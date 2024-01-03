<script lang="ts" setup>
import VueHcaptcha from '@hcaptcha/vue3-hcaptcha';
const { vueApp } = useNuxtApp();
const $route = useRoute();
const email = ref(null);
let captcha = null;

useHead({
  title: 'Apillon email airdrop prebuilt solution',
  titleTemplate: '',
});

async function signUp() {
  const res = await $api.post('/users', {
    token: '',
    email: email.value,
  });
  if (res.data && res.data.success) {
    alert('signed up');
  }
}

function captchaVerified(token: string, eKey: string) {
  console.log(token);
  captcha = token;
}

function captchaError(err: string) {
  captcha = null;
  console.log(err);
}

onMounted(async () => {});
</script>

<template>
  <div class="grid">
    <div class="text-lg">Sign up for airdrop</div>
    <br />
    <div>Input you email:</div>
    <input v-model="email" type="text" placeholder="test@email.com" />
    <vue-hcaptcha
      sitekey="f363ce6d-7543-4284-9caa-cf3219723f04"
      @verify="captchaVerified"
      @error="captchaError"
    ></vue-hcaptcha>
    <Btn :disabled="!email && !captcha" type="primary" @click="signUp()">Sign up</Btn>
  </div>
</template>
