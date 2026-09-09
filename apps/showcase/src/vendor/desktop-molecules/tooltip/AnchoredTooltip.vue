<script setup lang="ts">
/** Showcase stub — Crypto/Tag previews do not use truncate tooltips. */
defineProps<{
  content?: string;
  disabled?: boolean;
  trigger?: string;
  widthMode?: string;
  maxWidth?: number;
  heightMode?: string;
  scrollable?: boolean;
  tokenScopeClass?: string;
  boundarySelector?: string;
}>();
</script>

<template>
  <slot />
</template>
