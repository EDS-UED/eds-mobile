<script setup lang="ts">
import { computed } from 'vue';
import { findPatternCatalogItem } from '@/data/patterns';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const location = computed(() => findPatternCatalogItem(props.slug));
</script>

<template>
  <section v-if="location" :class="shared.section">
    <h2 :class="shared.sectionTitle">{{ location.item.name }}</h2>
    <p :class="shared.bodyText">{{ location.item.description }}</p>
    <p :class="shared.bodyText">Preview coming soon.</p>
  </section>
</template>
