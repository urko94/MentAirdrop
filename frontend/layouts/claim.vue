<template>
  <n-layout class="relative h-screen" :native-scrollbar="false">
    <div ref="headerRef">
      <Header logo-center />
    </div>
    <div class="container h-full pb-8 lg:pb-24 flex flex-col justify-center" :style="containerStyle">
      <slot />
    </div>
    <div>
      <Footer />
    </div>
  </n-layout>
</template>

<script lang="ts" setup>
/** Heading height */
const headerRef = ref<HTMLElement>();

const containerStyle = computed(() => {
  return {
    minHeight: `calc(100dvh - ${headerRef.value?.clientHeight || 0}px)`,
  };
});
</script>
