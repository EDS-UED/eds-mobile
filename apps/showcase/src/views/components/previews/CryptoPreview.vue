<script setup lang="ts">
import { computed } from 'vue';
import { EgTag } from '@eds/desktop-components';
import {
  EgCrypto,
  cryptoNames,
  formatCryptoDisplayName,
  getProcessedCrypto,
  resolveCryptoAssetKind,
} from '@eds/desktop-components';
import shared from '@/views/shared/showcase.module.css';
import styles from '../ComponentsView.module.css';
import { useAtomsGallerySearch } from './atomsGallerySearch';

const registeredCryptoNames = computed(() =>
  cryptoNames.filter((name) => Boolean(getProcessedCrypto(name))),
);

const query = useAtomsGallerySearch();

const filteredCryptoNames = computed(() => {
  const q = query.value.trim().toLowerCase();
  if (!q) return registeredCryptoNames.value;
  return registeredCryptoNames.value.filter((name) => name.toLowerCase().includes(q));
});

const filteredCryptoEntries = computed(() =>
  filteredCryptoNames.value.map((name) => ({
    name,
    displayName: formatCryptoDisplayName(name),
    kind: resolveCryptoAssetKind(name),
  })),
);
</script>

<template>
  <section id="crypto-gallery" :class="shared.section">
    <div :class="styles.iconGrid">
      <div v-for="entry in filteredCryptoEntries" :key="entry.name" :class="styles.iconCell">
        <div class="mobileTokens">
          <EgCrypto :name="entry.name" :class="styles.iconCellCryptoIcon" />
        </div>
        <span :class="styles.iconCellName">{{ entry.displayName }}</span>
        <span class="mobileTokens">
          <EgTag
            :class="styles.iconCellKindTag"
            size="sm"
            :system-type="entry.kind === 'Crypto' ? 'stroke-subtle' : 'stroke-solid'"
          >
            {{ entry.kind }}
          </EgTag>
        </span>
      </div>
    </div>
  </section>
</template>
