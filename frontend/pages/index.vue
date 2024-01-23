<script lang="ts" setup>
import { LoginResponse } from '~/components/parts/Header.vue';
import { useAccount, useConnect, useWalletClient } from 'use-wagmi';

const { error } = useMessage();
const userStore = useUserStore();
const { handleError } = useErrors();
const { isConnected } = useAccount();
const { connect, connectors } = useConnect();
const { data: walletClient, refetch } = useWalletClient();

definePageMeta({
  layout: 'admin',
});
useHead({
  title: 'Apillon email airdrop prebuilt solution',
});

const data = ref<UserInterface[]>([]);
const isLoggedIn = computed(() => isConnected.value && userStore.jwt);

onMounted(async () => {
  if (isLoggedIn.value) {
    await getUsers();
  }
});

watch(
  () => isLoggedIn.value,
  async _ => {
    if (isLoggedIn.value) {
      await getUsers();
    }
  }
);

async function getUsers() {
  const res = await $api.get<UsersResponse>('/users');
  data.value = res.data.items;
}

async function login() {
  await refetch();

  if (!walletClient.value) {
    await connect({ connector: connectors.value[0] });

    if (!walletClient.value) {
      error('Could not connect with wallet');
      return;
    }
  }
  try {
    const timestamp = new Date().getTime();
    const message = 'test';
    const signature = await walletClient.value.signMessage({ message: `${message}\n${timestamp}` });
    const res = await $api.post<LoginResponse>('/login', {
      signature,
      timestamp,
    });
    userStore.jwt = res.data.jwt;
    if (userStore.jwt) {
      $api.setToken(userStore.jwt);
      await getUsers();
    }
  } catch (e) {
    handleError(e);
  }
}
</script>

<template>
  <div class="grid">
    <div class="text-lg">Email airdrop</div>
    <Btn v-if="!isConnected" type="primary" @click="connect({ connector: connectors[0] })">
      Connect wallet
    </Btn>
    <Btn v-else-if="!data" type="primary" @click="login()">Login</Btn>
    <TableUsers v-else :users="data" />
  </div>
</template>
