<script setup lang="ts">
withDefaults(
  defineProps<{
    name?: string;
    fit?: boolean;
    size?: 'sm' | 'md' | 'lg';
  }>(),
  { name: 'eds-search', fit: false, size: 'md' },
);
</script>

<template>
  <svg
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    width="100%"
    height="100%"
  >
    <circle cx="7" cy="7" r="4.5" stroke="currentColor" stroke-width="1.2" />
    <path d="M10.5 10.5L13 13" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
  </svg>
</template>
