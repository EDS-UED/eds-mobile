<script setup lang="ts">
import { computed } from 'vue';
import { findAnimationMeta } from '@/data/animations';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const meta = computed(() => findAnimationMeta(props.slug));
</script>

<template>
  <section v-if="meta" :class="shared.section">
    <h2 :class="shared.sectionTitle">{{ meta.name }}</h2>
    <p :class="shared.bodyText">{{ meta.description }}</p>
    <p :class="shared.bodyText">iOS-native motion preview — Reanimated 实现中。</p>
  </section>
</template>
