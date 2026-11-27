import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';
import { resolveColor } from './resolveColor.js';
import type { ColorTagType } from './types.js';
import type { TagColorfulStyle, TagCustomStyle } from './tagFamilyTypes.js';

export type TagStatus = 'danger' | 'warning' | 'success' | 'ready' | 'invalid';

export function resolveColorTagColors(type: ColorTagType, mode: ThemeMode, alt = false) {
  const entry = mobileTheme.tags.mobileColor[type][mode];
  if (!alt) return { bg: entry.bg, text: entry.text };
  return { bg: entry.altBg, text: entry.text };
}

/** 状态 Tag · `tag-palette` status 组（Figma · 对齐 Desktop family=status）。 */
export function resolveTagStatusColors(status: TagStatus, mode: ThemeMode) {
  const entry = mobileTheme.tags.status[status][mode];
  return { bg: entry.bg, text: entry.text };
}

/** EgSystemTag 等 · `mobileStatus` 组。 */
export function resolveStatusTagColors(status: TagStatus, mode: ThemeMode) {
  const entry = mobileTheme.tags.mobileStatus[status][mode];
  return { bg: entry.bg, text: entry.text };
}

export function resolveColorfulTagColors(style: TagColorfulStyle, mode: ThemeMode) {
  const entry = mobileTheme.tags.colorful[style][mode];
  return { bg: entry.bg, text: entry.text };
}

export type TagCustomPaletteSide = { bg: string; text: string; bar: string };

export function resolveCustomTagPalette(style: TagCustomStyle, mode: ThemeMode): TagCustomPaletteSide {
  const entry = mobileTheme.tags.custom[style][mode] as TagCustomPaletteSide;
  return entry;
}

/** 商业 Tag · AML 等特例底色（对齐 Desktop Tag.module.css）。 */
export function resolveCustomTagAppearance(
  style: TagCustomStyle,
  mode: ThemeMode,
): { bar: string; labelColor: string; contentBg: string } {
  const colors = getThemeColors(mode);
  const palette = resolveCustomTagPalette(style, mode);

  switch (style) {
    case 'aml-danger':
      return {
        bar: resolveColor(colors, 'status-danger'),
        labelColor: resolveColor(colors, 'status-danger'),
        contentBg: resolveColor(colors, 'status-danger-weaken'),
      };
    case 'aml-safe':
      return {
        bar: palette.bar,
        labelColor: palette.bar,
        contentBg: palette.bg,
      };
    case 'aml-suspicious':
      return {
        bar: resolveColor(colors, 'status-warning'),
        labelColor: resolveColor(colors, 'status-warning'),
        contentBg: resolveColor(colors, 'status-warning-weaken'),
      };
    case 'aml-ready': {
      const ready = resolveTagStatusColors('ready', mode);
      return { bar: ready.text, labelColor: ready.text, contentBg: ready.bg };
    }
    case 'aml-invalid':
      return {
        bar: resolveColor(colors, 'stroke-base-tertiary'),
        labelColor: resolveColor(colors, 'text-base-tertiary'),
        contentBg: 'transparent',
      };
    default:
      return {
        bar: palette.bar,
        labelColor: resolveColor(colors, 'text-base-primary'),
        contentBg: 'transparent',
      };
  }
}
