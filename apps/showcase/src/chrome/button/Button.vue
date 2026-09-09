<script setup lang="ts">
import { computed, useSlots } from 'vue';
import styles from './Button.module.css';

/** Figma Style */
export type ButtonVariant = 'solid' | 'outline' | 'text';
/** Figma tone sets (Brand / Danger / Decor / Subtle / Same White) */
export type ButtonTone = 'brand' | 'danger' | 'decor' | 'subtle' | 'sameWhite';
export type ButtonSize = 'lg' | 'md' | 'sm' | 'xs';
/** #icon 相对文案：leading 在左，trailing 在右。 */
export type ButtonIconPosition = 'leading' | 'trailing';

const props = withDefaults(
  defineProps<{
    tone?: ButtonTone;
    variant?: ButtonVariant;
    size?: ButtonSize;
    disabled?: boolean;
    loading?: boolean;
    /** 菜单展开等选中态（Figma Active）；背景 `--event-focus`。 */
    active?: boolean;
    /** #icon 在文案 leading（左）或 trailing（右）。 */
    iconPosition?: ButtonIconPosition;
    type?: 'button' | 'submit' | 'reset';
  }>(),
  {
    tone: 'brand',
    variant: 'solid',
    size: 'lg',
    disabled: false,
    loading: false,
    active: false,
    iconPosition: 'leading',
    type: 'button',
  },
);

const slots = useSlots();

const isDisabled = computed(() => props.disabled || props.loading);
</script>

<template>
  <button
    :class="[
      'eds-button',
      styles.button,
      styles[props.tone],
      styles[props.variant],
      styles[props.size],
      loading && styles.loading,
      active && styles.active,
    ]"
    :disabled="isDisabled"
    :type="type"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" :class="styles.spinner" aria-hidden="true">
      <svg
        :class="styles.spinnerIcon"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8" r="6" stroke-dasharray="9 28" />
      </svg>
    </span>

    <template v-else>
      <span v-if="slots.icon && props.iconPosition === 'leading'" :class="styles.icon">
        <slot name="icon" />
      </span>
      <span :class="styles.label">
        <slot />
      </span>
      <span v-if="slots.icon && props.iconPosition === 'trailing'" :class="styles.icon">
        <slot name="icon" />
      </span>
    </template>
  </button>
</template>
