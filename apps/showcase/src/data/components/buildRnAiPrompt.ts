import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

import type { RnDocConfig } from './rnDocRegistry.js';
import {
  buildMenuSectionsFromCustomize,
  resolveMenuDefaultSelectedId,
  stripMenuCustomizeMeta,
} from './menuCustomizeModel.js';
import { resolveTabSlideAiCustomizeState } from './tabCustomizeModel.js';

const EDS_MOBILE_AI_RULES = [
  'Stack: React Native · Expo；样式用 StyleSheet + mobileTheme（@eds/mobile-tokens/theme），禁止 NativeWind/Tamagui。',
  '只使用 @eds/mobile-components（或 @eds-evergreen/mobile）的 Eg* 场景 export；禁止 @eds/desktop-* 与手拼 primitives 替代场景组件。',
  '非胶囊圆角用 theme.smoothRadius / edsSmoothRadius（borderCurve: continuous）；品牌与语义色走 token，禁止硬编码品牌 hex。',
  '动效用 @eds/mobile-animations：Base → mobileTheme.motion · base-*；Recipe EdsRecipeAnima(\'press\')；Semantic EdsSemanticAnima(\'press\' | \'slide\' …)。USAGE 写 consumer 组件（EgEdsAnimaPress · EgMenu 等）。',
].join('\n');

export type BuildRnAiPromptInput = {
  exportName: string;
  slug: string;
  figmaName?: string;
  tier?: string;
  family?: string;
  doc: RnDocConfig | undefined;
  customizeState: Record<string, unknown>;
  usageSnippet: string;
};

export function resolveRnAiCustomizeState(
  doc: RnDocConfig | undefined,
  customizeState: Record<string, unknown>,
): Record<string, unknown> {
  if (doc?.customizeLayout === 'menu-sections') {
    const merged = { ...(doc.customizeDefaults ?? {}), ...customizeState };
    const sections = buildMenuSectionsFromCustomize(merged);
    return {
      ...stripMenuCustomizeMeta(merged),
      sections,
      defaultSelectedId: resolveMenuDefaultSelectedId(merged, sections),
    };
  }
  if (
    doc &&
    (doc.componentTag === 'EgTab' || doc.componentTag === 'EgSegmentedControl')
  ) {
    return resolveTabSlideAiCustomizeState(doc, customizeState);
  }
  return customizeState;
}

export function buildRnAiPrompt(input: BuildRnAiPromptInput): string {
  const {
    exportName,
    slug,
    figmaName,
    tier,
    family,
    doc,
    customizeState,
    usageSnippet,
  } = input;

  const importCode =
    doc?.importCode ?? `import { ${exportName} } from '@eds/mobile-components';`;

  const metaLines = [
    figmaName ? `Figma: ${figmaName}` : null,
    tier ? `Tier: ${tier}` : null,
    family ? `Family: ${family}` : null,
    `Showcase slug: ${slug}`,
  ].filter(Boolean);

  const customizeForPrompt = resolveRnAiCustomizeState(doc, customizeState);

  const customizeLines = Object.entries(customizeForPrompt)
    .filter(([, value]) => value !== undefined && value !== '')
    .map(([key, value]) => {
      let serialized: string;
      try {
        serialized = typeof value === 'string' ? value : JSON.stringify(value);
      } catch {
        serialized = String(value);
      }
      return `- ${key}: ${serialized}`;
    });

  const propLines =
    doc?.propRows.map(
      (row) =>
        `- \`${row.name}\` (${row.type}) default ${row.defaultValue} — ${row.description}`,
    ) ?? [];

  const sections = [
    `# EDS Mobile — ${exportName}`,
    '',
    '## 组件',
    `- Export: \`${exportName}\` from \`@eds/mobile-components\``,
    ...metaLines.map((line) => `- ${line}`),
    '',
    '## 当前定制（Showcase Customize）',
    customizeLines.length > 0 ? customizeLines.join('\n') : '- （默认）',
    '',
    '## 示例代码',
    '```tsx',
    importCode,
    '',
    usageSnippet,
    '```',
    '',
    '## Props / API',
    propLines.length > 0 ? propLines.join('\n') : '- （见 showcase Props 表）',
    '',
    '## EDS Mobile 约束',
    EDS_MOBILE_AI_RULES,
    '',
    '---',
    '请基于以上 EDS Mobile 约定，在 consumer React Native 项目中实现或调整该组件用法。',
  ];

  return sections.join('\n');
}

export function figmaNameFromCatalogEntry(
  entry: { figmaName?: string; exportName: string } | undefined,
): string | undefined {
  if (!entry) return undefined;
  if ('figmaName' in entry && typeof entry.figmaName === 'string') {
    return entry.figmaName;
  }
  return undefined;
}

export function tierFamilyFromEntry(
  entry: FigmaComponentEntry | undefined,
): { tier?: string; family?: string } {
  if (!entry || !('tier' in entry)) {
    return {};
  }
  return { tier: entry.tier, family: entry.family };
}
