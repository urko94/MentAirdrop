<template>
  <n-layout class="relative h-screen" :native-scrollbar="false">
    <div ref="headerRef">
      <Header logo-center hide-login />
    </div>
    <div
      class="container h-full pb-8 lg:pb-24 flex flex-col justify-center"
      :style="containerStyle"
    >
      <slot />
    </div>
    <div ref="footerRef" class="justify-center">
      <Footer></Footer>
    </div>
  </n-layout>
</template>

<script lang="ts" setup>
/** Heading height */
const headerRef = ref<HTMLElement>();
const footerRef = ref<HTMLElement>();

const containerStyle = computed(() => {
  const hHeight = headerRef.value?.clientHeight || 0;
  const fHeight = footerRef.value?.clientHeight || 0;
  return {
    minHeight: `calc(100dvh - ${hHeight + fHeight}px)`,
  };
});
</script>
