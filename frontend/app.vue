<script lang="ts" setup>
import { NaiveTheme } from '~/lib/config/naive';
</script>

<template>
  <div class="h-full">
    <n-config-provider :theme-overrides="NaiveTheme" class="flex h-full flex-col">
      <n-message-provider>
        <div class="page-container flex-grow pb-32 pt-1 md:pt-12">
          <NuxtPage />
        </div>
      </n-message-provider>

      <n-global-style />
    </n-config-provider>
  </div>
</template>
