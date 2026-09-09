<script setup lang="ts">
import { RouterView } from 'vue-router';
import styles from './ShowcaseLayout.module.css';
import ShowcaseNav from './ShowcaseNav.vue';
import ThemeToggle from '@/components/shared/ThemeToggle.vue';
import { provideShowcaseContentTheme } from '@/composables/useShowcaseContentTheme';

const { contentRef, theme } = provideShowcaseContentTheme();
</script>

<template>
  <div :class="styles.shell">
    <aside :class="styles.sidebar">
      <div :class="styles.brand">
        <p :class="styles.brandTitle">EDS Mobile</p>
        <p :class="styles.brandSub">@Mobile</p>
      </div>

      <div :class="styles.sidebarScroll">
        <ShowcaseNav />
      </div>

      <div :class="styles.sidebarFooter">
        <ThemeToggle />
      </div>
    </aside>

    <main ref="contentRef" :class="styles.content" :data-theme="theme">
      <div :class="styles.contentScroll">
        <RouterView />
      </div>
    </main>
  </div>
</template>
