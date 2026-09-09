<script setup lang="ts">
import { EgButton } from '@eds/desktop-components';
import { useShowcaseContentTheme } from '@/composables/useShowcaseContentTheme';

const { theme, toggleTheme } = useShowcaseContentTheme();
</script>

<template>
  <div class="mobileTokens">
    <EgButton
      tone="sameWhite"
      variant="outline"
      size="md"
      @click="toggleTheme"
    >
      {{ theme === 'light' ? 'Dark' : 'Light' }}
    </EgButton>
  </div>
</template>
