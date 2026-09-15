<script setup lang="ts">
import { computed } from 'vue';
import CodeSnippet from '@/components/shared/CodeSnippet.vue';
import { findAnimationMeta } from '@/data/animations';
import shared from '@/views/shared/showcase.module.css';

const props = defineProps<{
  slug: string;
}>();

const meta = computed(() => findAnimationMeta(props.slug));
</script>

<template>
  <section v-if="meta" :class="shared.section">
    <h2 :class="shared.sectionTitle">{{ meta.name }}</h2>
    <p :class="shared.bodyText">{{ meta.description }}</p>

    <template v-if="meta.whenToUse">
      <h3 :class="shared.sectionTitle">什么时候用</h3>
      <p :class="shared.bodyText">{{ meta.whenToUse }}</p>
    </template>

    <template v-if="meta.rnImport || meta.rnExample">
      <h3 :class="shared.sectionTitle">RN 用法</h3>
      <p v-if="meta.rnImport" :class="shared.bodyText">
        Import：<code :class="shared.codeText">{{ meta.rnImport }}</code>
      </p>
      <CodeSnippet v-if="meta.rnExample" :code="meta.rnExample" language="typescript" />
    </template>

    <template v-if="meta.cssClass">
      <h3 :class="shared.sectionTitle">Showcase CSS（Web 文档对照）</h3>
      <p :class="shared.bodyText">
        RN consumer 不需要 CSS class。Showcase 过渡壳可用
        <code :class="shared.codeText">.{{ meta.cssClass }}</code>
      </p>
    </template>

    <template v-if="meta.avoid">
      <h3 :class="shared.sectionTitle">不要这样做</h3>
      <p :class="shared.bodyText">{{ meta.avoid }}</p>
    </template>

    <p v-if="props.slug === 'motion-start'" :class="shared.bodyText">
      架构：
      <code :class="shared.codeText">Base → Recipe → Semantic</code>
      （Semantic 沿用
      <code :class="shared.codeText">.motion-tap</code>
      等，非文档 8 场景）。解析链见
      <code :class="shared.codeText">@eds/mobile-tokens/motion/catalog</code>。
    </p>
  </section>
</template>
