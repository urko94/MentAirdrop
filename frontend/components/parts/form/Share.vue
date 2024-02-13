<script lang="ts" setup>
import { Chains } from '~/lib/values/general.values';

defineProps({
  metadata: { type: Object as PropType<Metadata>, default: null },
  txHash: { type: String, default: null },
});

const nuxtConfig = useRuntimeConfig();

function transactionLink(transactionHash?: string | null): string {
  switch (nuxtConfig.public.CHAIN_ID) {
    case Chains.MOONBEAM:
      return transactionHash
        ? `https://moonbeam.moonscan.io/tx/${transactionHash}`
        : 'https://moonbeam.moonscan.io';
    case Chains.MOONBASE:
      return transactionHash
        ? `https://moonbase.moonscan.io/tx/${transactionHash}`
        : 'https://moonbase.moonscan.io';
    case Chains.ASTAR:
      return transactionHash
        ? `https://astar.subscan.io/tx/${transactionHash}`
        : 'https://astar.subscan.io';
    default:
      console.warn('Missing chainId');
      return '';
  }
}
</script>

<template>
  <div v-if="metadata" class="max-w-md w-full md:px-6 my-12 mx-auto">
    <div class="my-8 text-center">
      <h3 class="mb-6">AchieveMENT unlocked!</h3>
      <p>You are now a proud owner of a MENT token!</p>
      <p>Display Your '{{ metadata.name }}' NFT collectible by sharing it on X.</p>
    </div>

    <div class="rounded-lg overflow-hidden mb-8">
      <img :src="metadata.image" class="" width="400" height="400" alt="nft" />
      <div class="p-6 bg-bg-light">
        <h5>{{ metadata.name }}</h5>
      </div>
      <div class="mt-4 text-center">
        <p class="mb-4">{{ metadata.description }}</p>
        <a
          v-if="txHash"
          :href="transactionLink(txHash)"
          class="text-black hover:underline"
          target="_blank"
        >
          Transaction: {{ shortHash(txHash) }}
        </a>
      </div>
    </div>

    <Btn
      type="secondary"
      size="large"
      :href="`https://twitter.com/intent/tweet?text=Display Your '${metadata.name}' NFT Collectible by sharing it on X.`"
    >
      <span class="inline-flex gap-2 items-center text-black">
        <NuxtIcon name="x" class="text-xl" />
        <span>Share on X</span>
      </span>
    </Btn>
  </div>
</template>
