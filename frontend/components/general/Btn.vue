<script lang="ts" setup>
import { ButtonProps } from 'naive-ui';

/**
 * https://github.com/vuejs/core/issues/8286#issuecomment-1545659320
 * Remove once naive-ui updates (https://github.com/tusen-ai/naive-ui/issues/4810)
 */
interface Props extends /* @vue-ignore */ ButtonProps {
  to?: string;
  wrapperClass?: string;
  label?: string;
}

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<Props>();
const attrs = useAttrs();
</script>

<template>
  <NuxtLink
    v-if="props.to"
    :to="props.to"
    :class="props.wrapperClass"
    class="no-underline"
    tabindex="-1"
  >
    <n-button :type="props.type || 'primary'" v-bind="$attrs" :theme-overrides="themeOverrides">
      <span v-if="props.label">{{ props.label }}</span>

      <slot v-else />

      <template #icon>
        <slot name="icon" />
      </template>
    </n-button>
  </NuxtLink>

  <n-button
    v-else
    :type="props.type || 'primary'"
    v-bind="$attrs"
    :theme-overrides="themeOverrides"
  >
    <span v-if="props.label">{{ props.label }}</span>

    <slot v-else />

    <template #icon>
      <slot name="icon" />
    </template>
  </n-button>
</template>
