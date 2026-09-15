<script setup lang="ts">
import { computed, onBeforeUnmount, ref, watch } from 'vue';
import { EgButton } from '@/stubs/eds-components';
import { SHOWCASE_LOCALE_OPTIONS } from '@/data/i18n/showcaseLocaleOptions';
import {
  getShowcaseLocaleSecondaryLabel,
  getShowcaseLocaleShortLabel,
} from '@/data/i18n/showcaseLocaleCatalog';
import { useShowcaseI18n } from '@/composables/useShowcaseI18n';
import { useShowcaseLocale } from '@/composables/useShowcaseLocale';
import type { ShowcaseLocale } from '@/data/i18n/types';
import styles from './LocaleSelect.module.css';

const { locale, setLocale } = useShowcaseLocale();
const i18n = useShowcaseI18n();

const open = ref(false);
const rootRef = ref<HTMLElement | null>(null);

const languageAriaLabel = computed(() => {
  void locale.value;
  return i18n.name('shell:language', 'Language');
});

const shortLabel = computed(() => getShowcaseLocaleShortLabel(locale.value));

const localeOptions = computed(() => {
  const uiLocale = locale.value;
  return SHOWCASE_LOCALE_OPTIONS.map((entry) => ({
    ...entry,
    secondaryLabel: getShowcaseLocaleSecondaryLabel(entry.id, uiLocale),
  }));
});

function selectLocale(next: ShowcaseLocale) {
  setLocale(next);
  open.value = false;
}

function toggleOpen() {
  open.value = !open.value;
}

function onDocumentPointerDown(event: PointerEvent) {
  if (!open.value) return;
  const root = rootRef.value;
  if (!root || root.contains(event.target as Node)) return;
  open.value = false;
}

function onEscape(event: KeyboardEvent) {
  if (event.key === 'Escape') {
    open.value = false;
  }
}

watch(open, (isOpen) => {
  if (typeof document === 'undefined') return;
  if (isOpen) {
    document.addEventListener('pointerdown', onDocumentPointerDown, true);
    document.addEventListener('keydown', onEscape);
  } else {
    document.removeEventListener('pointerdown', onDocumentPointerDown, true);
    document.removeEventListener('keydown', onEscape);
  }
});

onBeforeUnmount(() => {
  if (typeof document === 'undefined') return;
  document.removeEventListener('pointerdown', onDocumentPointerDown, true);
  document.removeEventListener('keydown', onEscape);
});

</script>

<template>
  <div ref="rootRef" class="mobileTokens" :class="styles.root">
    <EgButton
      tone="sameWhite"
      variant="outline"
      size="md"
      :class="styles.trigger"
      :aria-label="languageAriaLabel"
      aria-haspopup="listbox"
      :aria-expanded="open"
      @click="toggleOpen"
    >
      <span :class="styles.triggerLabel">{{ shortLabel }}</span>
    </EgButton>

    <div v-if="open" :class="styles.menu" role="listbox" :aria-label="languageAriaLabel">
      <div :class="styles.optionList">
        <button
          v-for="entry in localeOptions"
          :key="entry.id"
          type="button"
          role="option"
          :aria-selected="locale === entry.id"
          :class="[styles.option, locale === entry.id && styles.optionSelected]"
          @click="selectLocale(entry.id)"
        >
          <span :class="styles.optionPrimary">{{ entry.nativeLabel }}</span>
          <span :class="styles.optionSecondary">{{ entry.secondaryLabel }}</span>
        </button>
      </div>
    </div>
  </div>
</template>
