<script setup lang="ts">
import { computed } from 'vue';
import {
  EgDecide,
  EgFlotation,
  EgFlotationTrigger,
  EgInput,
} from '@/stubs/eds-components';
import { galleryLabelFromTokenLabel } from '@/data/showcasePropLabels';
import styles from './ComponentDocLayout.module.css';
import type {
  DocCustomizeBooleanControl,
  DocCustomizeControl,
  DocCustomizeSelectControl,
} from './types';

const props = defineProps<{
  control: DocCustomizeControl;
  value: unknown;
  inlineSelectValue?: unknown;
}>();

const emit = defineEmits<{
  update: [value: unknown];
  inlineSelectUpdate: [value: unknown];
}>();

const booleanControl = computed(() =>
  props.control.kind === 'boolean' ? (props.control as DocCustomizeBooleanControl) : null,
);

const inlineSelect = computed(() => booleanControl.value?.inlineSelect);

const showInlineSelect = computed(
  () => Boolean(props.value) && inlineSelect.value != null,
);

const inlineSelectModel = computed(
  () =>
    String(
      props.inlineSelectValue
        ?? inlineSelect.value?.options[0]?.value
        ?? '',
    ),
);

function selectOptionIndex(
  control: { options: DocCustomizeSelectControl['options'] },
  currentValue: unknown,
): number {
  const index = control.options.findIndex(
    (option) => option.value === String(currentValue ?? ''),
  );
  return index >= 0 ? index : 0;
}

function customizeSelectDisplayLabel(label: string): string {
  return galleryLabelFromTokenLabel(label);
}

function selectFlotationItems(control: { options: DocCustomizeSelectControl['options'] }) {
  return control.options.map((option) => ({
    label: customizeSelectDisplayLabel(option.label),
    boxType: 'text' as const,
  }));
}

function selectCurrentLabel(
  control: { options: DocCustomizeSelectControl['options'] },
  currentValue: unknown,
) {
  const match = control.options.find(
    (option) => option.value === String(currentValue ?? ''),
  );
  const label = match?.label ?? control.options[0]?.label ?? '';
  return customizeSelectDisplayLabel(label);
}

function onSelectOption(
  control: { options: DocCustomizeSelectControl['options'] },
  index: number,
  handler: (value: unknown) => void,
) {
  const option = control.options[index];
  if (!option) return;
  handler(option.value);
}

function emitSelectUpdate(control: DocCustomizeSelectControl, index: number) {
  onSelectOption(control, index, (next) => emit('update', next));
}

function emitInlineSelectUpdate(
  control: NonNullable<DocCustomizeBooleanControl['inlineSelect']>,
  index: number,
) {
  onSelectOption(control, index, (next) => emit('inlineSelectUpdate', next));
}

function handleSelectItemClick(control: DocCustomizeControl, index: number) {
  if (control.kind !== 'select') return;
  emitSelectUpdate(control, index);
}
</script>

<template>
  <div :class="styles.customizeField">
    <span :class="styles.customizeLabel">{{ control.label }}</span>
    <div
      :class="[
        styles.customizeControlSlot,
        showInlineSelect && styles.customizeControlSlotWithInline,
      ]"
    >
      <template v-if="control.kind === 'boolean'">
        <EgDecide
          :class="styles.customizeDecide"
          :model-value="Boolean(value)"
          @update:model-value="emit('update', $event)"
        />
        <div v-if="showInlineSelect && inlineSelect" :class="styles.customizeInlineSelectGroup">
          <span :class="styles.customizeInlineSelectLabel">{{ inlineSelect.label }}</span>
          <EgFlotation
            :key="`${inlineSelect.key}-${inlineSelectModel}`"
            :class="styles.customizeInlineFlotation"
            trigger-size="sm"
            trigger-style="subtle"
            width-mode="trigger"
            :show-add="false"
            :show-menu-divider="false"
            :selected-index="selectOptionIndex(inlineSelect, inlineSelectModel)"
            :items="selectFlotationItems(inlineSelect)"
            @item-click="(_item, index) => emitInlineSelectUpdate(inlineSelect!, index)"
          >
            <template #trigger="{ expanded }">
              <EgFlotationTrigger
                trigger-style="subtle"
                size="sm"
                width-mode="adaptive"
                :label="selectCurrentLabel(inlineSelect, inlineSelectModel)"
                :expanded="expanded"
              />
            </template>
          </EgFlotation>
        </div>
      </template>
      <EgFlotation
        v-else-if="control.kind === 'select'"
        :key="`${control.key}-${String(value ?? '')}`"
        :class="styles.customizeFlotationSelect"
        trigger-size="sm"
        trigger-style="subtle"
        width-mode="trigger"
        :show-add="false"
        :show-menu-divider="false"
        :selected-index="selectOptionIndex(control, value)"
        :items="selectFlotationItems(control)"
        @item-click="(_item, index) => handleSelectItemClick(control, index)"
      >
        <template #trigger="{ expanded }">
          <EgFlotationTrigger
            trigger-style="subtle"
            size="sm"
            width-mode="adaptive"
            :label="selectCurrentLabel(control, value)"
            :expanded="expanded"
          />
        </template>
      </EgFlotation>
      <EgInput
        v-else-if="control.kind === 'text'"
        size="sm"
        width-mode="full"
        clearable
        :class="styles.customizeInput"
        :model-value="String(value ?? '')"
        :placeholder="control.placeholder"
        @update:model-value="emit('update', $event)"
      />
    </div>
  </div>
</template>
