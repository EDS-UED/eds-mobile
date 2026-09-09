<script setup lang="ts">
import { computed, toRef } from 'vue';
import { formatGroupedNumber } from '../utils/formatGroupedNumber';
import styles from './Tab.module.css';
import { useSlidingThumb } from './useSlidingThumb';

export type SegmentedSize = 'lg' | 'md' | 'sm';
export type SegmentedShape = 'circle' | 'square';
export type SegmentedItemWidthMode = 'adaptive' | 'fixed';

const props = withDefaults(
  defineProps<{
    modelValue?: number;
    size?: SegmentedSize;
    shape?: SegmentedShape;
    labels?: string[];
    /** Item 宽度：adaptive=内容 hug；fixed=父级定宽后 item 均分。 */
    itemWidthMode?: SegmentedItemWidthMode;
    /** itemWidthMode=fixed 时可指定容器宽度（px）；未传则 width:100% 跟随父级。 */
    width?: number;
  }>(),
  {
    modelValue: 0,
    size: 'md',
    shape: 'circle',
    labels: () => ['Tab', 'Tab', 'Tab'],
    itemWidthMode: 'adaptive',
    width: undefined,
  },
);

const emit = defineEmits<{
  'update:modelValue': [index: number];
}>();

const sizeClass = computed(() => {
  switch (props.size) {
    case 'lg':
      return styles.itemLg;
    case 'sm':
      return styles.itemSm;
    default:
      return styles.itemMd;
  }
});

const activeIndex = toRef(props, 'modelValue');
const itemCount = computed(() => props.labels.length);
const displayLabels = computed(() => props.labels.map((label) => formatGroupedNumber(label)));
const { trackRef, setItemRef, thumbStyle, ready } = useSlidingThumb(activeIndex, itemCount);

const isFixedItemWidth = computed(() => props.itemWidthMode === 'fixed');

const rootStyle = computed(() => {
  if (!isFixedItemWidth.value || props.width == null || props.width <= 0) {
    return undefined;
  }
  return { width: `${props.width}px` };
});

function select(index: number) {
  emit('update:modelValue', index);
}
</script>

<template>
  <div
    :class="[
      'eds-segmented',
      styles.segment,
      shape === 'square' && styles.segmentSquare,
      shape === 'square' && styles.square,
      isFixedItemWidth ? styles.segmentFixedItemWidth : styles.segmentAdaptiveItemWidth,
    ]"
    :style="rootStyle"
    role="tablist"
  >
    <div
      ref="trackRef"
      :class="[styles.track, isFixedItemWidth && styles.trackFixedItemWidth]"
    >
      <span
        :class="[styles.segmentThumb, ready && styles.segmentThumbReady]"
        :style="thumbStyle"
        aria-hidden="true"
      />
      <button
        v-for="(label, index) in displayLabels"
        :key="index"
        :ref="setItemRef(index)"
        type="button"
        role="tab"
        :class="[
          styles.item,
          sizeClass,
          modelValue === index && styles.itemSelected,
          isFixedItemWidth && styles.itemFixedWidth,
        ]"
        :aria-selected="modelValue === index"
        @click="select(index)"
      >
        {{ label }}
      </button>
    </div>
  </div>
</template>
