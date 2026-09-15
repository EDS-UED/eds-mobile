<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import {
  AVATAR_NATIVE_PALETTE,
  AVATAR_ROBOT_ASSET_NAME,
  EgAvatar,
  formatAvatarPaletteName,
} from '@/stubs/eds-components';
import ComponentDocLayout from '@/views/shared/componentDoc/ComponentDocLayout.vue';
import previewPageStyles from './InputPreview.module.css';
import galleryStyles from './TagPreviewGallery.module.css';
import TagPreviewGallery from './TagPreviewGallery.vue';
import { avatarPropRows, avatarImportCode } from './avatarPreviewData';
import {
  avatarCustomizeControls,
  avatarCustomizeDefaults,
  avatarSizeOptions,
  buildAvatarUsageSnippet,
  resolveAvatarPreviewProps,
} from './avatarDocCustomize';

const avatarCustomize = reactive({
  ...avatarCustomizeDefaults,
  size: avatarCustomizeDefaults.size as 'xs' | 'sm' | 'md' | 'lg' | 'xl',
  variant: avatarCustomizeDefaults.variant as 'initials' | 'robot',
  colorIndexMode: avatarCustomizeDefaults.colorIndexMode as 'auto' | string,
});

const avatarUsageSnippet = computed(() => buildAvatarUsageSnippet(avatarCustomize));

const previewProps = computed(() => resolveAvatarPreviewProps(avatarCustomize));

const previewRenderKey = ref(0);

const selectedPaletteValue = computed(() => {
  if (avatarCustomize.variant === 'robot') {
    return AVATAR_ROBOT_ASSET_NAME;
  }
  if (avatarCustomize.colorIndexMode !== 'auto') {
    return formatAvatarPaletteName(Number(avatarCustomize.colorIndexMode));
  }
  return '';
});

watch(
  () => [avatarCustomize.randomColor, avatarCustomize.name, avatarCustomize.colorIndexMode],
  () => {
    if (avatarCustomize.randomColor) {
      previewRenderKey.value += 1;
    }
  },
);

function onResetPreview() {
  if (avatarCustomize.randomColor) {
    previewRenderKey.value += 1;
  }
}

function selectAvatarSize(value: string) {
  avatarCustomize.size = value as typeof avatarCustomize.size;
}

function selectPaletteValue(value: string) {
  if (value === AVATAR_ROBOT_ASSET_NAME) {
    avatarCustomize.variant = 'robot';
    avatarCustomize.randomColor = false;
    return;
  }

  const match = /^web3-avatar-(\d+)$/.exec(value);
  if (!match) return;

  avatarCustomize.variant = 'initials';
  avatarCustomize.colorIndexMode = String(Number(match[1]) - 1);
  avatarCustomize.randomColor = false;
}
</script>

<template>
  <div :class="previewPageStyles.previewPage">
    <ComponentDocLayout
      v-model:customize-state="avatarCustomize"
      title="Avatar"
      :show-doc-title="false"
      component-tag="EgAvatar"
      :import-code="avatarImportCode"
      :customize-controls="avatarCustomizeControls"
      :customize-defaults="avatarCustomizeDefaults"
      :usage-snippet-override="avatarUsageSnippet"
      :prop-rows="avatarPropRows"
      props-section-id="avatar-props"
      @reset-preview="onResetPreview"
    >
      <template #preview>
        <TagPreviewGallery
          :options="[...avatarSizeOptions]"
          :selected="avatarCustomize.size"
          gallery-label="尺寸"
          :fill-preview-height="false"
          @select="selectAvatarSize"
        >
          <template #main>
            <EgAvatar v-bind="previewProps" :key="previewRenderKey" />
          </template>
          <template #item="{ value }">
            <EgAvatar
              v-bind="resolveAvatarPreviewProps(avatarCustomize, value)"
              :key="`${previewRenderKey}-${value}`"
            />
          </template>
          <template #footer>
            <div
              id="avatar-palette"
              :class="galleryStyles.nestedGallery"
              role="listbox"
              aria-label="web3-avatar"
            >
              <button
                type="button"
                role="option"
                :aria-selected="selectedPaletteValue === AVATAR_ROBOT_ASSET_NAME"
                :class="[
                  galleryStyles.galleryItem,
                  selectedPaletteValue === AVATAR_ROBOT_ASSET_NAME && galleryStyles.galleryItemSelected,
                ]"
                @click="selectPaletteValue(AVATAR_ROBOT_ASSET_NAME)"
              >
                <EgAvatar variant="robot" size="sm" />
                <span :class="galleryStyles.galleryLabel">{{ AVATAR_ROBOT_ASSET_NAME }}</span>
              </button>
              <button
                v-for="(color, index) in AVATAR_NATIVE_PALETTE"
                :key="color.hex"
                type="button"
                role="option"
                :aria-selected="selectedPaletteValue === formatAvatarPaletteName(index)"
                :class="[
                  galleryStyles.galleryItem,
                  selectedPaletteValue === formatAvatarPaletteName(index) && galleryStyles.galleryItemSelected,
                ]"
                @click="selectPaletteValue(formatAvatarPaletteName(index))"
              >
                <EgAvatar
                  initials="A"
                  :color-index="index"
                  size="sm"
                />
                <span :class="galleryStyles.galleryLabel">{{ formatAvatarPaletteName(index) }}</span>
              </button>
            </div>
          </template>
        </TagPreviewGallery>
      </template>
    </ComponentDocLayout>
  </div>
</template>
