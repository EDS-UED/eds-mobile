<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import EgIcon from '../icons/Icon.vue';
import styles from './Search.module.css';

export type SearchWidthMode = 'fixed' | 'full';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    placeholder?: string;
    disabled?: boolean;
    readonly?: boolean;
    widthMode?: SearchWidthMode;
  }>(),
  {
    modelValue: '',
    placeholder: 'Search',
    disabled: false,
    readonly: false,
    widthMode: 'fixed',
  },
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  clear: [];
  focus: [event: FocusEvent];
  blur: [event: FocusEvent];
}>();

const inputRef = ref<HTMLInputElement | null>(null);
const fieldRef = ref<HTMLElement | null>(null);
const fieldFocused = ref(false);
const suppressBlur = ref(false);

const showClear = computed(
  () =>
    fieldFocused.value
    && !props.disabled
    && !props.readonly
    && props.modelValue.length > 0,
);

function onFieldFocusIn() {
  fieldFocused.value = true;
}

function onFieldFocusOut(event: FocusEvent) {
  const field = event.currentTarget as HTMLElement;
  if (field.contains(event.relatedTarget as Node)) {
    return;
  }

  fieldFocused.value = false;
}

function onInput(event: Event) {
  emit('update:modelValue', (event.target as HTMLInputElement).value);
}

function onFocus(event: FocusEvent) {
  emit('focus', event);
}

function onBlur(event: FocusEvent) {
  if (suppressBlur.value) {
    return;
  }

  const field = fieldRef.value;
  if (field?.contains(event.relatedTarget as Node)) {
    return;
  }

  emit('blur', event);
}

function onFieldClick(event: MouseEvent) {
  if (props.disabled || props.readonly) {
    return;
  }

  const target = event.target as HTMLElement;
  if (target.closest('button')) {
    return;
  }

  inputRef.value?.focus();
}

function onClear() {
  suppressBlur.value = true;
  emit('update:modelValue', '');
  emit('clear');

  void nextTick(() => {
    inputRef.value?.focus({ preventScroll: true });
    requestAnimationFrame(() => {
      suppressBlur.value = false;
    });
  });
}

function focusInput() {
  inputRef.value?.focus();
}

defineExpose({
  focus: focusInput,
});
</script>

<template>
  <div
    :class="[
      styles.root,
      widthMode === 'full' ? styles.widthFull : styles.widthFixed,
    ]"
  >
    <div
      ref="fieldRef"
      :class="[
        'eds-input-field',
        styles.field,
        disabled && styles.fieldDisabled,
      ]"
      @click="onFieldClick"
      @focusin="onFieldFocusIn"
      @focusout="onFieldFocusOut"
    >
      <span :class="styles.icon">
        <EgIcon name="eds-search" fit />
      </span>

      <div :class="[styles.inputWrap, showClear && styles.inputWrapWithClear]">
        <input
          ref="inputRef"
          :class="['eds-input-control', styles.input]"
          type="search"
          :value="modelValue"
          :placeholder="placeholder"
          :disabled="disabled"
          :readonly="readonly"
          spellcheck="false"
          @input="onInput"
          @focus="onFocus"
          @blur="onBlur"
        />
      </div>

      <button
        v-if="showClear"
        type="button"
        :class="styles.clearButton"
        aria-label="Clear"
        tabindex="-1"
        @mousedown.prevent
        @pointerdown.prevent
        @click="onClear"
      >
        <svg
          :class="styles.clearIcon"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <circle cx="8" cy="8" r="7" fill="currentColor" />
          <path
            d="M6 6l4 4m0-4-4 4"
            stroke="var(--material-same-white-primary)"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>
