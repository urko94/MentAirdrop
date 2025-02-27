import { verify } from "hcaptcha";
import { AppEnvironment, ValidatorErrorCode } from "../config/values";
import { env } from "../config/env";
import { ResourceError } from "./errors";

export type Captcha = { eKey: string; token: string };
/**
 * Given a captcha token, verify if the token is valid and the captcha has been successfully solved by the user
 * @param {string} captchaToken
 * @returns {Promise<boolean>}
 */
export async function checkCaptcha(captchaToken: string): Promise<boolean> {
  if (
    [AppEnvironment.LOCAL_DEV, AppEnvironment.TEST].includes(
      env.APP_ENV as AppEnvironment
    )
  ) {
    return true;
  }

  if (!env.CAPTCHA_SECRET) {
    throwCodeException(ValidatorErrorCode.CAPTCHA_NOT_CONFIGURED);
  }

  if (!captchaToken) {
    throwCodeException(ValidatorErrorCode.CAPTCHA_NOT_PRESENT);
  }

  if (
    env.APP_ENV != AppEnvironment.LOCAL_DEV! &&
    (await verifyCaptcha(captchaToken))
  ) {
    throwCodeException(ValidatorErrorCode.CAPTCHA_INVALID);
  }

  return true;
}

async function verifyCaptcha(
  token: string,
  secret: string = env.CAPTCHA_SECRET
): Promise<boolean> {
  try {
    return (await verify(secret, token)).success;
  } catch (err) {
    console.error("Error verifying captcha!", err);
    throw err;
  }
}

function throwCodeException(code: ValidatorErrorCode) {
  throw new ResourceError(code, null, "checkCaptcha");
}
