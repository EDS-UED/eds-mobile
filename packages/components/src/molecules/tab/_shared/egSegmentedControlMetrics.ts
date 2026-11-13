import { mobileTheme } from '../../../theme/index.js';

export type EgSegmentedControlSize = 'lg' | 'md' | 'sm';

const spacing = mobileTheme.spacing;
const footnoteLineHeight = mobileTheme.typography.base['line-height-footnote'] as number;

/** Figma Segmented Control 493:4341 · track inset `spacing-05` (2px)。 */
export function egSegmentedControlTrackPadding(): number {
  return spacing['spacing-05'] as number;
}

/**
 * Figma Base_Segmented Control · Circle · Default/Focus 内边距。
 * Lg spacing-5 × spacing-2 · Md spacing-4 × spacing-1 · Sm spacing-3 × spacing-05。
 */
export function egSegmentedControlSegmentPadding(size: EgSegmentedControlSize): {
  paddingHorizontal: number;
  paddingVertical: number;
} {
  switch (size) {
    case 'lg':
      return {
        paddingHorizontal: spacing['spacing-5'] as number,
        paddingVertical: spacing['spacing-2'] as number,
      };
    case 'md':
      return {
        paddingHorizontal: spacing['spacing-4'] as number,
        paddingVertical: spacing['spacing-1'] as number,
      };
    case 'sm':
    default:
      return {
        paddingHorizontal: spacing['spacing-3'] as number,
        paddingVertical: spacing['spacing-05'] as number,
      };
  }
}

/** 单段内容区高度 · Footnote Strong 行高 + 段 vertical padding（Figma 量：32 / 24 / 20）。 */
export function egSegmentedControlSegmentMinHeight(size: EgSegmentedControlSize): number {
  const { paddingVertical } = egSegmentedControlSegmentPadding(size);
  return paddingVertical * 2 + footnoteLineHeight;
}

/** 轨道外框最小高度（Figma Size=Lg/Md/Sm：36 / 28 / 24）。 */
export function egSegmentedControlTrackMinHeight(size: EgSegmentedControlSize): number {
  const inset = egSegmentedControlTrackPadding();
  return inset * 2 + egSegmentedControlSegmentMinHeight(size);
}
