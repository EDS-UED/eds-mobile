<script setup lang="ts">
import { computed } from 'vue';
import shared from '@/views/shared/showcase.module.css';
import CustomizeControlField from './CustomizeControlField.vue';
import styles from './ComponentDocLayout.module.css';
import {
  filterDocCustomizeControls,
  isControlVisible,
  type DocCustomizeControl,
} from './types';

const props = defineProps<{
  controls: DocCustomizeControl[];
  /** Section heading; default「定制」. Nested panels use component tag (e.g. EgFormSubmission). */
  title?: string;
  /** Nested component customize: smaller mono heading (two type steps below section title). */
  nested?: boolean;
  /**
   * 嵌套标题圆点：引用组件（默认）→ 品红；普通标题 → 紫色。
   */
  nestedTitleVariant?: 'referenced-component' | 'simple-title';
  /** Single-column stack (e.g. Nav Bar module names top-to-bottom). */
  sequential?: boolean;
  /** Fields per horizontal row when sequential + control.row groups (default 4). */
  rowColumns?: number;
  /** Render inside a parent customize section (no outer section wrapper). */
  embedded?: boolean;
  /** Omit section heading (e.g. nested panel when parent field already labels the slot). */
  hideTitle?: boolean;
}>();

const rowColumns = computed(() => Math.max(1, props.rowColumns ?? 4));

const nestedTitleClass = computed(() => {
  if (!props.nested && !props.embedded) return undefined;
  return props.nestedTitleVariant === 'simple-title'
    ? styles.customizeNestedTitleSimple
    : styles.customizeNestedTitleReferenced;
});

const sequentialRowsStyle = computed(() => ({
  '--customize-row-columns': String(rowColumns.value),
}));

const state = defineModel<Record<string, unknown>>({ required: true });

const customizeControls = computed(() => filterDocCustomizeControls(props.controls));

const visibleControls = computed(() =>
  customizeControls.value.filter((control) => isControlVisible(control, state.value)),
);

const useSequentialRows = computed(
  () => props.sequential && customizeControls.value.some((control) => control.row != null),
);

const sequentialRowGroups = computed(() => {
  if (!useSequentialRows.value) return [];

  const groups: { row: number; controls: DocCustomizeControl[] }[] = [];

  for (const control of visibleControls.value) {
    const row = control.row ?? 0;
    const last = groups[groups.length - 1];

    if (last && last.row === row) {
      last.controls.push(control);
      continue;
    }

    groups.push({ row, controls: [control] });
  }

  return groups;
});

function patchKey(key: string, value: unknown) {
  const current = state.value;
  if (!current || typeof current !== 'object') return;
  current[key] = value;

  const control = customizeControls.value.find((item) => item.key === key);
  if (control?.kind === 'boolean' && value === true && control.inlineSelect) {
    const inlineKey = control.inlineSelect.key;
    if (current[inlineKey] == null || current[inlineKey] === '') {
      current[inlineKey] = control.inlineSelect.options[0]?.value ?? 'leading';
    }
  }

  if (value !== true) return;
  if (control?.kind !== 'boolean' || !control.exclusiveKey) return;
  current[control.exclusiveKey] = false;
}

function patchInlineSelect(control: DocCustomizeControl, value: unknown) {
  if (control.kind !== 'boolean' || !control.inlineSelect) return;
  patchKey(control.inlineSelect.key, value);
}
</script>

<template>
  <component
    :is="embedded ? 'div' : 'section'"
    :class="[
      embedded ? styles.customizeEmbedded : [shared.section, styles.customizeSection],
      'mobileTokens',
    ]"
  >
    <h2
      v-if="!hideTitle"
      :class="[
        nested || embedded ? styles.customizeNestedTitle : shared.sectionTitle,
        nestedTitleClass,
      ]"
    >
      {{ title ?? '定制' }}
    </h2>
    <div
      v-if="useSequentialRows && visibleControls.length"
      :class="styles.customizeGridSequentialRows"
      :style="sequentialRowsStyle"
    >
      <div
        v-for="group in sequentialRowGroups"
        :key="group.controls.map((control) => control.key).join('-')"
        :class="[
          styles.customizeRow,
          group.controls.length === 1 &&
            group.controls[0]?.kind === 'heading' &&
            styles.customizeHeadingRow,
        ]"
      >
        <template v-for="control in group.controls" :key="control.key">
          <div
            v-if="control.kind === 'heading'"
            :class="styles.customizeField"
          >
            <span :class="[styles.customizeLabel, styles.customizeGroupLabel]">
              {{ control.label }}
            </span>
          </div>
          <CustomizeControlField
            v-else
            :control="control"
            :value="state[control.key]"
            :inline-select-value="
              control.kind === 'boolean' && control.inlineSelect
                ? state[control.inlineSelect.key]
                : undefined
            "
            @update="patchKey(control.key, $event)"
            @inline-select-update="patchInlineSelect(control, $event)"
          />
        </template>
      </div>
    </div>
    <div
      v-else-if="visibleControls.length"
      :class="sequential ? styles.customizeGridSequential : styles.customizeGrid"
    >
      <CustomizeControlField
        v-for="control in visibleControls"
        :key="control.key"
        :control="control"
        :value="state[control.key]"
        :inline-select-value="
          control.kind === 'boolean' && control.inlineSelect
            ? state[control.inlineSelect.key]
            : undefined
        "
        @update="patchKey(control.key, $event)"
        @inline-select-update="patchInlineSelect(control, $event)"
      />
    </div>
    <slot name="extra" />
  </component>
</template>
