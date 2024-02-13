<script lang="ts" setup>
import SuperRareJpg from '~/images/superrare.jpg';
useHead({
  title: 'Apillon email airdrop prebuilt solution',
});
</script>

<template>
  <!-- #region UNSTOPPABLE NFTS -->
  <div class="my-20 flex flex-col gap-x-12 gap-y-8 md:flex-row lg:my-32">
    <div class="max-w-2xl md:pr-12">
      <span class="mb-2 inline-block text-xs font-bold uppercase tracking-[0.2em] text-info">The Shape of MENT to Come</span>
      <h1>Sign up and win your MENT token</h1>

      <p class="body-lg mb-6">
        By signing up, you’ll be in the game for the hottest perks in the form of MENT token
      </p>
      <div class="max-w-sm">
        <FormSighUp btn-text="Sign up" />
      </div>
    </div>
    <div class="flex-cc relative w-full">
      <img :src="SuperRareJpg" width="461" height="461" alt="Super rare NFT" />
    </div>
  </div>
</template>
