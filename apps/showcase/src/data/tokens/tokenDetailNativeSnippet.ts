import mobileTheme from '@eds/mobile-tokens/theme';
import type { ViewStyle } from 'react-native';

import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import type { TokenEntry } from '@/data/tokens/tokenCatalogTypes';
import {
  formatEdsRecipeAnimaCall,
  formatEdsSemanticAnimaCall,
  formatMotionBaseThemeAccessLine,
  motionBaseDisplayName,
  motionBaseThemeAccess,
  motionRecipeIdForTokenEntry,
  motionSemanticHasRecipe,
  motionSemanticScenarioIdForTokenEntry,
  resolveMotionTokenLiveNativeSnippet,
} from '@/data/tokens/motionNativeDisplay';
import { resolveEffectPreviewModel } from '@/views/tokens/effectTokenPreviewStyle';

export type NativeSnippetPlatform = 'ios' | 'android';
export type NativeSnippetMode = 'light' | 'dark';

function quote(value: string) {
  return `'${value.replace(/\\/g, '\\\\').replace(/'/g, "\\'")}'`;
}

function formatValue(value: unknown, depth = 0): string {
  if (value == null) {
    return 'undefined';
  }
  if (typeof value === 'string') {
    return quote(value);
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map((item) => formatValue(item, depth + 1)).join(', ')}]`;
  }
  if (typeof value === 'object') {
    return formatStyleObject(value as Record<string, unknown>, depth + 1);
  }
  return String(value);
}

function formatStyleObject(style: Record<string, unknown>, depth = 0): string {
  const pad = '  '.repeat(depth);
  const inner = '  '.repeat(depth + 1);
  const lines = ['{'];
  for (const [key, value] of Object.entries(style)) {
    if (value === undefined) {
      continue;
    }
    lines.push(`${inner}${key}: ${formatValue(value, depth + 1)},`);
  }
  lines.push(`${pad}}`);
  return lines.join('\n');
}

function pickPlatformStyle(style: ViewStyle, platform: NativeSnippetPlatform): ViewStyle {
  if (platform === 'ios') {
    return {
      ...style,
      borderCurve: style.borderRadius != null ? 'continuous' : undefined,
    } as ViewStyle;
  }

  const { shadowColor, shadowOffset, shadowOpacity, shadowRadius, ...rest } = style;
  const elevation =
    typeof style.elevation === 'number'
      ? style.elevation
      : typeof shadowRadius === 'number'
        ? Math.max(2, Math.round(shadowRadius / 2))
        : 4;

  return { ...rest, elevation };
}

function effectNativeSnippet(
  entry: TokenEntry,
  platform: NativeSnippetPlatform,
  mode: NativeSnippetMode,
  colors: ShowcaseColorMap,
): string {
  const model = resolveEffectPreviewModel(entry, mode, colors);
  const style = pickPlatformStyle(model.circleStyle, platform);
  const lines: string[] = [
    "import { StyleSheet } from 'react-native';",
  ];

  if (model.blurIntensity != null && !entry.name.startsWith('glass-')) {
    lines.push("import { BlurView } from 'expo-blur';");
  }

  if (entry.name.startsWith('glass-')) {
    lines.splice(
      0,
      0,
      "import { EgGlass } from '@eds/mobile-components';",
      '',
    );
    lines.push(
      '',
      `const mode = ${quote(mode)} as const;`,
      '',
      `<EgGlass box={${quote(entry.name)}} mode={mode} style={styles.glassBox} />`,
      '',
      'StyleSheet.create({',
      '  glassBox: {',
      '    width: 240,',
      '    height: 240,',
      '  },',
      '});',
    );
    return lines.join('\n');
  }

  lines.push(
    '',
    'StyleSheet.create({',
    `  preview: ${formatStyleObject(style as Record<string, unknown>, 1)},`,
    '});',
  );

  if (model.blurIntensity != null) {
    lines.push('');
    if (platform === 'ios') {
      lines.push(
        `<BlurView`,
        `  intensity={${model.blurIntensity}}`,
        `  tint={${quote(mode === 'dark' ? 'dark' : 'light')}}`,
        `  style={StyleSheet.absoluteFill}`,
        `/>`,
      );
    } else {
      lines.push(
        `<BlurView`,
        `  intensity={${model.blurIntensity}}`,
        `  tint={${quote(mode === 'dark' ? 'dark' : 'light')}}`,
        `  blurMethod="dimezisBlurView"`,
        `  style={StyleSheet.absoluteFill}`,
        `/>`,
      );
    }
  }

  return lines.join('\n');
}

function colorNativeSnippet(entry: TokenEntry, mode: NativeSnippetMode): string {
  const key = entry.name.replace(/^eds-/, '');
  return [
    "import mobileTheme from '@eds/mobile-tokens/theme';",
    '',
    `mobileTheme.colors.${mode}[${quote(key)}]`,
  ].join('\n');
}

function scaleNativeSnippet(entry: TokenEntry): string {
  const resolved = mobileTheme.spacing[entry.name];
  if (resolved !== undefined) {
    return [
      "import mobileTheme from '@eds/mobile-tokens/theme';",
      '',
      `mobileTheme.spacing[${quote(entry.name)}] // ${resolved}`,
    ].join('\n');
  }

  const scaleKey = entry.name;
  const multiplier = mobileTheme.scale[scaleKey];
  if (typeof multiplier === 'number') {
    const unit = mobileTheme.spacing['scale-base'];
    const px = typeof unit === 'number' ? multiplier * unit : multiplier;
    return [
      "import mobileTheme from '@eds/mobile-tokens/theme';",
      '',
      `mobileTheme.scale[${quote(scaleKey)}] * mobileTheme.spacing['scale-base'] // ${px}`,
    ].join('\n');
  }

  return [
    "import mobileTheme from '@eds/mobile-tokens/theme';",
    '',
    `mobileTheme.spacing[${quote(entry.name)}]`,
  ].join('\n');
}

function motionNativeSnippet(entry: TokenEntry): string {
  const live = resolveMotionTokenLiveNativeSnippet(entry);

  if (entry.layer === 'base') {
    const access = motionBaseThemeAccess(entry.name);
    const lines = [
      "import mobileTheme from '@eds/mobile-tokens/theme';",
      '',
      `${formatMotionBaseThemeAccessLine(access)} // ${motionBaseDisplayName(entry.name)}`,
    ];
    if (live) {
      lines.push('', live);
    }
    return lines.join('\n');
  }

  if (entry.layer === 'recipe') {
    const recipeId = motionRecipeIdForTokenEntry(entry);
    if (!recipeId) {
      return entry.name;
    }
    const lines = [
      "import { EdsRecipeAnima } from '@eds/mobile-animations';",
      '',
      `${formatEdsRecipeAnimaCall(recipeId)}.springConfig`,
    ];
    if (live) {
      lines.push('', live);
    }
    return lines.join('\n');
  }

  if (entry.layer === 'semantic') {
    const scenario = motionSemanticScenarioIdForTokenEntry(entry);
    if (scenario && motionSemanticHasRecipe(entry.name)) {
      const lines = [
        "import { EdsSemanticAnima } from '@eds/mobile-animations';",
        '',
        `${formatEdsSemanticAnimaCall(scenario)}.springConfig`,
      ];
      if (live) {
        lines.push('', live);
      }
      return lines.join('\n');
    }
    return [`// CSS · .${entry.name}`, `// ${entry.cssVar}`].join('\n');
  }

  return entry.name;
}

export function resolveTokenDetailNativeSnippet(
  categoryId: string,
  entry: TokenEntry,
  platform: NativeSnippetPlatform,
  mode: NativeSnippetMode,
  colors: ShowcaseColorMap,
): string | undefined {
  switch (categoryId) {
    case 'effect':
      return effectNativeSnippet(entry, platform, mode, colors);
    case 'color':
      return colorNativeSnippet(entry, mode);
    case 'scale':
      return scaleNativeSnippet(entry);
    case 'motion':
      return motionNativeSnippet(entry);
    default:
      return undefined;
  }
}
