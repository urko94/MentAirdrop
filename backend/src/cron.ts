import { CronJob } from "cron";
import { AirdropStatus } from "./models/user";
import { dateToSqlString } from "./lib/sql-utils";
import { SqlModelStatus } from "./models/base-sql-model";
import { MysqlConnectionManager } from "./lib/mysql-connection-manager";
import { SmtpSendTemplate } from "./lib/node-mailer";
import { env } from "./config/env";
import { generateEmailAirdropToken } from "./lib/jwt";
import { LogType, writeLog } from "./lib/logger";
import { LogLevel, Nft } from "@apillon/sdk";

export class Cron {
  private cronJobs: CronJob[] = [];

  constructor() {
    this.cronJobs.push(new CronJob("* * * * *", this.sendEmail, null, false));
  }

  async start() {
    const collection = await new Nft({
      key: env.APILLON_KEY,
      secret: env.APILLON_SECRET,
      logLevel: LogLevel.VERBOSE,
    })
      .collection(env.COLLECTION_UUID)
      .get();

    /**If collection has limited supply, start job which will manage user airdrop waiting line*/
    if (collection.maxSupply > 0) {
      this.cronJobs.push(
        new CronJob("* * * * *", this.processExpiredClaims, null, false)
      );
    }

    for (const cronJob of this.cronJobs) {
      cronJob.start();
    }
  }

  async stop() {
    for (const cronJob of this.cronJobs) {
      cronJob.stop();
    }
    await MysqlConnectionManager.destroyInstance();
  }

  async sendEmail() {
    const mysql = await MysqlConnectionManager.getInstance();

    const collection = await new Nft({
      key: env.APILLON_KEY,
      secret: env.APILLON_SECRET,
      logLevel: LogLevel.VERBOSE,
    })
      .collection(env.COLLECTION_UUID)
      .get();

    let availableNftLeft = 0;
    if (collection.maxSupply) {
      const res = await mysql.db.execute(
        `SELECT COUNT(id) as total FROM user WHERE
          airdrop_status IN (
            ${AirdropStatus.EMAIL_SENT},
            ${AirdropStatus.WALLET_LINKED},
            ${AirdropStatus.TRANSACTION_CREATED},
            ${AirdropStatus.AIRDROP_COMPLETED}
          )
          AND status = ${SqlModelStatus.ACTIVE}
        ;
       `
      );
      const numOfReservations = res[0][0].total;
      availableNftLeft = collection.maxSupply - numOfReservations;
    }

    const conn = await mysql.start();
    await conn.beginTransaction();

    try {
      const res = await conn.execute(
        `SELECT * FROM user WHERE
          airdrop_status = ${AirdropStatus.PENDING}
          AND status = ${SqlModelStatus.ACTIVE}
          AND email_start_send_time < '${dateToSqlString(new Date())}'
          FOR UPDATE
        ;
       `
      );
      const users = res[0] as Array<any>;
      const updates = [];

      for (let i = 0; i < users.length; i++) {
        try {
          if (!collection.maxSupply || i < availableNftLeft) {
            const token = await generateEmailAirdropToken(users[i].email);
            await SmtpSendTemplate(
              [users[i].email],
              "Claim your NFT",
              "en-airdrop-claim",
              {
                link: `${env.APP_URL}/claim?token=${token}`,
              }
            );
            updates.push(
              `(${users[i].id}, '${users[i].email}', ${
                AirdropStatus.EMAIL_SENT
              }, '${dateToSqlString(new Date())}')`
            );
          } else {
            //Currently, waiting line for airdrop is full.Send info email and set appropriate status
            await SmtpSendTemplate(
              [users[i].email],
              "You are in waiting line for NFT claim",
              "en-airdrop-waiting-line",
              {}
            );
            updates.push(
              `(${users[i].id}, '${users[i].email}', ${
                AirdropStatus.IN_WAITING_LINE
              }, '${dateToSqlString(new Date())}')`
            );
          }
        } catch (e) {
          writeLog(LogType.ERROR, e, "cron.ts", "sendEmail");
          updates.push(
            `(${users[i].id}, '${users[i].email}', ${
              AirdropStatus.EMAIL_ERROR
            }, '${dateToSqlString(new Date())}')`
          );
        }
      }

      if (updates.length) {
        const sql = `
        INSERT INTO user (id, email, airdrop_status, email_sent_time)
        VALUES ${updates.join(",")}
        ON DUPLICATE KEY UPDATE
        airdrop_status = VALUES(airdrop_status),
        email_sent_time = VALUES(email_sent_time)`;

        await conn.execute(sql);
      }

      await conn.commit();
    } catch (e) {
      writeLog(LogType.ERROR, e, "cron.ts", "sendEmail");
      await conn.rollback();
    }
  }

  async processExpiredClaims() {
    const mysql = await MysqlConnectionManager.getInstance();
    const conn = await mysql.start();
    await conn.beginTransaction();

    try {
      const res = await conn.execute(
        `SELECT * FROM user WHERE
          airdrop_status = ${AirdropStatus.EMAIL_SENT}
          AND status = ${SqlModelStatus.ACTIVE}
          AND DATE_ADD(email_sent_time, INTERVAL ${env.CLAIM_EXPIRES_IN} HOUR) < NOW()
          FOR UPDATE
        ;
       `
      );
      const usersWithExpiredClaim = (res[0] as Array<any>).map((x) => x.id);

      if (usersWithExpiredClaim.length) {
        //Update those users to claim expired
        await conn.execute(
          `UPDATE user 
          SET airdrop_status = ${AirdropStatus.AIRDROP_CLAIM_EXPIRED}
          WHERE id IN (${usersWithExpiredClaim.join(",")})
        ;
       `
        );

        //Get users in waiting line and set their airdrop status to PENDING, so that they will recieve email for claim
        const usersInWaitingLine = (
          await conn.execute(
            `SELECT * FROM user WHERE
          airdrop_status = ${AirdropStatus.IN_WAITING_LINE}
          AND status = ${SqlModelStatus.ACTIVE}
          LIMIT ${usersWithExpiredClaim.length}
          FOR UPDATE
        ;
       `
          )
        )[0] as Array<any>;

        if (usersInWaitingLine.length) {
          await conn.query(
            `UPDATE user 
                SET airdrop_status = ${AirdropStatus.PENDING}
                WHERE id IN (${usersInWaitingLine.map((x) => x.id).join(",")})
              ;
            `
          );
        }
      }

      await conn.commit();
    } catch (e) {
      writeLog(LogType.ERROR, e, "cron.ts", "processExpiredClaims");
      await conn.rollback();
    }
  }
}
