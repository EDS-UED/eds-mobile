<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import styles from './Icon.module.css';
import { getProcessedIcon, type IconName } from './iconRegistry';
import type { IconFillTone } from './processSvg';
import { sizeIconMarkup } from './sizeIconMarkup';

const ICON_PX = { sm: 16, md: 20, lg: 24 } as const;

const props = withDefaults(
  defineProps<{
    name: IconName;
    size?: 'sm' | 'md' | 'lg';
    /** Size to parent slot (e.g. EgIconButton); ignores fixed sm/md/lg box. */
    fit?: boolean;
    label?: string;
    /** 仅 token 单色填充图标；彩色 fixed 图标忽略此 prop。 */
    fillTone?: IconFillTone;
  }>(),
  {
    size: 'md',
    fit: false,
  },
);

const rootRef = ref<HTMLElement | null>(null);
const displayPx = ref<number>(ICON_PX[props.size]);

function syncDisplayPx() {
  const px = rootRef.value?.getBoundingClientRect().width ?? 0;
  if (px > 0) displayPx.value = Math.round(px);
}

let resizeObserver: ResizeObserver | undefined;

onMounted(() => {
  if (props.fit) {
    syncDisplayPx();
    if (typeof ResizeObserver !== 'undefined' && rootRef.value) {
      resizeObserver = new ResizeObserver(() => syncDisplayPx());
      resizeObserver.observe(rootRef.value);
    }
  }
});

onBeforeUnmount(() => {
  resizeObserver?.disconnect();
});

const processed = computed(() => getProcessedIcon(String(props.name)));

const sizedMarkup = computed(() => {
  const icon = processed.value;
  if (!icon) return '';
  const px = props.fit ? displayPx.value : ICON_PX[props.size];
  return sizeIconMarkup(icon.markup, px);
});

const iconStrokeStyle = computed(() => {
  const icon = processed.value;
  if (!icon || icon.colorMode !== 'token') return undefined;
  const px = Math.round(props.fit ? displayPx.value : ICON_PX[props.size]);
  const safePx = px > 0 ? px : ICON_PX[props.size];
  return { '--eds-icon-display-px': String(safePx) } as Record<string, string>;
});

const kindClass = computed(() => {
  const icon = processed.value;
  if (!icon || icon.colorMode === 'fixed') return styles.fixedKind;
  const tone = props.fillTone ?? icon.fillTone;
  return [
    styles.tokenKind,
    tone === 'brand' ? styles.tokenFillBrand : styles.tokenFillPrimary,
  ];
});

const hostClass = computed(() => [
  styles.icon,
  props.fit ? styles.fill : styles[props.size],
  ...(Array.isArray(kindClass.value) ? kindClass.value : [kindClass.value]),
]);

const ariaLabel = computed(() => props.label || String(props.name));
</script>

<template>
  <span
    v-if="processed"
    ref="rootRef"
    :class="hostClass"
    :style="iconStrokeStyle"
    role="img"
    :data-icon="name"
    :aria-label="label ? ariaLabel : undefined"
    :aria-hidden="label ? undefined : true"
  >
    <span class="eds-icon" :class="styles.svgHost" v-html="sizedMarkup" />
  </span>
</template>
