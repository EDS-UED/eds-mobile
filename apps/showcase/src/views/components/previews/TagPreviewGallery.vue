<script setup lang="ts">
import docStyles from '@/views/shared/componentDoc/ComponentDocLayout.module.css';
import galleryStyles from './TagPreviewGallery.module.css';

export type TagGalleryOption = {
  value: string;
  label: string;
};

const props =   withDefaults(
  defineProps<{
    options: TagGalleryOption[];
    selected: string;
    galleryLabel?: string;
    /** true：撑满 Tag 文档固定预览高（480px）；默认随内容增高。 */
    fillPreviewHeight?: boolean;
  }>(),
  {
    fillPreviewHeight: false,
  },
);

const emit = defineEmits<{
  select: [value: string];
}>();
</script>

<template>
  <div
    class="mobileTokens"
    :class="[
      docStyles.previewInputHost,
      galleryStyles.host,
      !props.fillPreviewHeight && galleryStyles.hostNaturalHeight,
    ]"
  >
    <div :class="galleryStyles.main">
      <slot name="main" />
    </div>

    <div
      :class="galleryStyles.gallery"
      role="listbox"
      :aria-label="galleryLabel ?? '样式'"
    >
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        role="option"
        :aria-selected="selected === option.value"
        :class="[
          galleryStyles.galleryItem,
          selected === option.value && galleryStyles.galleryItemSelected,
        ]"
        @click="emit('select', option.value)"
      >
        <slot name="item" :value="option.value" />
        <span :class="galleryStyles.galleryLabel">{{ option.label }}</span>
      </button>
    </div>

    <div v-if="$slots.footer" :class="galleryStyles.footer">
      <slot name="footer" />
    </div>
  </div>
</template>
