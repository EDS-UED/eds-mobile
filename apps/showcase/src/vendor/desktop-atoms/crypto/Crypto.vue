<script setup lang="ts">
import { computed } from 'vue';
import styles from './Crypto.module.css';
import {
  formatCryptoDisplayName,
  getProcessedCrypto,
  resolveCryptoFileName,
} from './cryptoRegistry';

const props = withDefaults(
  defineProps<{
    /** canonical 文件名、业务名（无 `eds-`）或网络链名，与 SVG 元数据一致。 */
    name: string;
    size?: 'sm' | 'md' | 'lg';
    fit?: boolean;
    label?: string;
  }>(),
  {
    size: 'md',
    fit: false,
  },
);

const resolvedFileName = computed(() => resolveCryptoFileName(String(props.name)));

const processed = computed(() => {
  const fileName = resolvedFileName.value;
  if (!fileName) return undefined;
  return getProcessedCrypto(fileName);
});

const businessName = computed(() => {
  const fileName = resolvedFileName.value;
  if (fileName) return formatCryptoDisplayName(fileName);
  return formatCryptoDisplayName(String(props.name));
});

const hostClass = computed(() => [
  styles.root,
  props.fit ? styles.fill : styles[props.size],
]);

const ariaLabel = computed(() => props.label || businessName.value);
</script>

<template>
  <span
    v-if="processed"
    :class="hostClass"
    role="img"
    :data-crypto="businessName"
    :aria-label="label ? ariaLabel : undefined"
    :aria-hidden="label ? undefined : true"
  >
    <span class="eds-crypto" :class="styles.svgHost" v-html="processed.markup" />
  </span>
</template>
