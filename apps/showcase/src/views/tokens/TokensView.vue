<script setup lang="ts">
import { computed } from 'vue';
import tokens from '@eds/mobile-tokens/json';
import '@/styles/text-style-preview.css';
import PageHeader from '@/components/shared/PageHeader.vue';
import PageAnchors from '@/components/shared/PageAnchors.vue';
import TokenParamRows from '@/components/tokens/TokenParamRows.vue';
import TokenThemeRows from '@/components/tokens/TokenThemeRows.vue';
import { tokenAnchorItems } from '@/data/tokens';
import { sortColorBaseRows } from '@/data/tokens/colorBase';
import {
  colorSemanticGroupKey,
  colorSemanticGroupLabels,
  colorSemanticGroupOrder,
  sortColorSemanticItems,
} from '@/data/tokens/colorSemantic';
import { textStyleOrder } from '@/data/tokens/textStyles';
import { scaleSemanticGroups, toAnchorId } from '@/data/tokens/scaleSemantic';
import {
  entriesToRows,
  formatEffectSemantic,
  formatStyleLabel,
  formatTextStyleMetrics,
} from './tokensDisplay';
import styles from './TokensView.module.css';
import shared from '@/views/shared/showcase.module.css';

const anchorItems = tokenAnchorItems;

const colorBaseRows = computed(() => {
  const light = tokens.colorBase_light as Record<string, { hex: string }>;
  const dark = tokens.colorBase_dark as Record<string, { hex: string }>;

  return sortColorBaseRows(
    Object.keys(light).map((name) => ({
      name,
      light: light[name].hex,
      dark: dark[name]?.hex ?? '',
    })),
  );
});

const colorGroups = computed(() => {
  const light = tokens.colorSemantic_light as Record<string, string>;
  const dark = tokens.colorSemantic_dark as Record<string, string>;
  const groups = new Map<string, Array<{ name: string; light: string; dark: string }>>();

  for (const name of Object.keys(light)) {
    const groupKey = colorSemanticGroupKey(name);
    if (!groups.has(groupKey)) groups.set(groupKey, []);
    groups.get(groupKey)?.push({
      name,
      light: light[name],
      dark: dark[name] ?? '',
    });
  }

  const ordered = colorSemanticGroupOrder
    .filter((key) => groups.has(key))
    .map((key) => [key, sortColorSemanticItems(key, groups.get(key)!)] as const);

  const leftover = [...groups.keys()]
    .filter((key) => !colorSemanticGroupOrder.includes(key as (typeof colorSemanticGroupOrder)[number]))
    .sort()
    .map((key) => [key, sortColorSemanticItems(key, groups.get(key)!)] as const);

  return [...ordered, ...leftover];
});

const colorGroupTitle = (groupKey: string) =>
  colorSemanticGroupLabels[groupKey] ?? groupKey;

const scaleBaseRows = computed(() => {
  const base = tokens.scaleBase as {
    scaleBase: number;
    resolved: Record<string, string>;
  };

  return [
    { name: 'scale-base', value: `${base.scaleBase}px` },
    ...entriesToRows(base.resolved),
  ];
});

const scaleSemantic = tokens.scaleSemantic as Record<string, string>;

const scaleSemanticSections = computed(() =>
  scaleSemanticGroups.map((group) => ({
    id: toAnchorId('scale-semantic', group.title),
    title: group.title,
    items: entriesToRows(
      Object.fromEntries(
        Object.entries(scaleSemantic).filter(([name]) => group.match(name)),
      ),
    ),
  })),
);

const typographyBase = tokens.typographyBase as Record<string, string>;

const typographyBaseRows = computed(() => entriesToRows(typographyBase));

const typographySemantic = tokens.typographySemantic as Record<string, string>;

const typographySemanticRows = computed(() => entriesToRows(typographySemantic));

const textStyles = tokens.textStyles as Record<
  string,
  { 'font-size': string; 'font-weight': string; 'line-height': string }
>;

const textStyleItems = textStyleOrder
  .filter((key) => textStyles[key])
  .map((key) => ({
    key,
    label: formatStyleLabel(key),
    metrics: formatTextStyleMetrics(textStyles[key], typographySemantic, typographyBase),
  }));

const motionRecipeRows = computed(() =>
  entriesToRows(tokens.motionRecipe as Record<string, string>),
);

const motionBaseRows = computed(() =>
  entriesToRows(tokens.motionBase as Record<string, string>),
);

const motionSemanticRows = computed(() =>
  Object.entries(tokens.motionSemantic as Record<string, Record<string, string>>).map(
    ([name, value]) => ({
      name: `.${name}`,
      value: formatEffectSemantic(value),
    }),
  ),
);

const motionUtilityRows = computed(() =>
  Object.entries(tokens.motionUtilities as Record<string, Record<string, string>>).map(
    ([name, value]) => ({
      name: `.${name}`,
      value: value.transition ?? JSON.stringify(value),
    }),
  ),
);

const effectBaseRows = computed(() =>
  entriesToRows((tokens.effectBase as { tokens: Record<string, string> }).tokens),
);

const effectSemanticRows = computed(() =>
  Object.entries(tokens.effectSemantic as Record<string, Record<string, string>>).map(
    ([name, value]) => ({
      name: `.${name}`,
      value: formatEffectSemantic(value),
    }),
  ),
);
</script>

<template>
  <div :class="styles.pageWithAnchors">
    <div :class="shared.page">
      <PageHeader
        title="Tokens"
        lead="Desktop global variables from @eds/mobile-tokens."
      />

      <section id="color-base" :class="shared.section">
        <h2 :class="shared.sectionTitle">Color Base</h2>
        <TokenThemeRows :rows="colorBaseRows" />
      </section>

      <section id="color-semantic" :class="shared.section">
        <h2 :class="shared.sectionTitle">Color Semantic</h2>
        <div :class="styles.colorSemantics">
          <div v-for="[group, items] in colorGroups" :key="group" :class="styles.colorGroup">
            <h3 :class="styles.colorGroupTitle">{{ colorGroupTitle(group) }}</h3>
            <div v-for="item in items" :key="item.name" :class="styles.tokenRow">
              <span :class="[shared.bodyText, styles.tokenName]">{{ item.name }}</span>
              <span :class="[shared.codeText, styles.tokenValue]">{{ item.light }}</span>
              <span :class="[shared.codeText, styles.tokenValue]">{{ item.dark }}</span>
            </div>
          </div>
        </div>
      </section>

      <section id="scale-base" :class="shared.section">
        <h2 :class="shared.sectionTitle">Scale Base</h2>
        <TokenParamRows :rows="scaleBaseRows" />
      </section>

      <section id="scale-semantic" :class="shared.section">
        <h2 :class="shared.sectionTitle">Scale Semantic</h2>
        <div :class="styles.scaleSemantic">
          <div
            v-for="section in scaleSemanticSections"
            :key="section.id"
            :class="styles.subsection"
          >
            <h3 :id="section.id" :class="styles.subsectionTitle">{{ section.title }}</h3>
            <div
              v-if="section.title === 'Spacing'"
              class="mobileTokens"
              :class="styles.spacingList"
            >
              <div v-for="item in section.items" :key="item.name" :class="styles.spacingRow">
                <span :class="shared.bodyText">{{ item.name }}</span>
                <div :class="styles.spacingBar" :style="{ width: `var(--${item.name})` }" />
                <span :class="[shared.codeText, styles.spacingValue]">{{ item.value }}</span>
              </div>
            </div>
            <TokenParamRows v-else :rows="section.items" />
          </div>
        </div>
      </section>

      <section id="typography-base" :class="shared.section">
        <h2 :class="shared.sectionTitle">Typography Base</h2>
        <TokenParamRows :rows="typographyBaseRows" />
      </section>

      <section id="typography-semantic" :class="shared.section">
        <h2 :class="shared.sectionTitle">Typography Semantic</h2>
        <TokenParamRows :rows="typographySemanticRows" />
      </section>

      <section id="text-style" :class="shared.section">
        <h2 :class="shared.sectionTitle">Text Style</h2>
        <div class="mobileTokens" :class="styles.typeStack">
          <div v-for="item in textStyleItems" :key="item.key" :class="styles.typeRow">
            <div :class="[styles.typeSample, item.key]">
              {{ item.label }}
            </div>
            <span :class="[shared.codeText, styles.typeMetrics]">{{ item.metrics }}</span>
          </div>
        </div>
      </section>

      <section id="motion-base" :class="shared.section">
        <h2 :class="shared.sectionTitle">Motion Base</h2>
        <TokenParamRows :rows="motionBaseRows" />
      </section>

      <section id="motion-recipe" :class="shared.section">
        <h2 :class="shared.sectionTitle">Motion Recipe</h2>
        <TokenParamRows :rows="motionRecipeRows" />
      </section>

      <section id="motion-semantic" :class="shared.section">
        <h2 :class="shared.sectionTitle">Motion Semantic</h2>
        <TokenParamRows :rows="motionSemanticRows" />
        <h3 :class="styles.subsectionTitle">Utility Classes</h3>
        <TokenParamRows :rows="motionUtilityRows" />
      </section>

      <section id="effect-base" :class="shared.section">
        <h2 :class="shared.sectionTitle">Effect Base</h2>
        <TokenParamRows :rows="effectBaseRows" />
      </section>

      <section id="effect-semantic" :class="shared.section">
        <h2 :class="shared.sectionTitle">Effect Semantic</h2>
        <TokenParamRows :rows="effectSemanticRows" />
      </section>
    </div>

    <PageAnchors :items="anchorItems" />
  </div>
</template>
