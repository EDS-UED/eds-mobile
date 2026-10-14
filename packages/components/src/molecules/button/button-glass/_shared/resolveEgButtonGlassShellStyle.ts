import type { ViewStyle } from 'react-native';
import {
  buttonPaddingHorizontal,
  buttonPaddingVertical,
} from '../../../../shared/controlMetrics.js';
import type { ControlSize } from '../../../../shared/types.js';
import { mobileTheme } from '../../../../theme/index.js';
import type { EgButtonGlassIconCount, EgButtonGlassKind } from '../EgButtonGlass.types.js';

/** iOS 工具栏控件最小边长 — spacing-10 + spacing-1 = 44px。 */
export function egButtonGlassIconMinSize(): number {
  const spacing = mobileTheme.spacing;
  return (spacing['spacing-10'] as number) + (spacing['spacing-1'] as number);
}

function egButtonGlassIconSymbolPx(): number {
  return mobileTheme.spacing['symbol-md'] as number;
}

/** 双 icon 行内容宽 — 2×symbol-md + spacing-4 间距。 */
export function egButtonGlassDualIconRowWidth(): number {
  const spacing = mobileTheme.spacing;
  const symbol = egButtonGlassIconSymbolPx();
  const gap = spacing['spacing-4'] as number;
  return symbol + gap + symbol;
}

/** Icon 胶囊 shell — 单 icon：spacing-05 + 最小 44×44；双 icon：左右 spacing-4，宽随内容撑开。 */
export function resolveEgButtonGlassIconShellStyle(
  iconCount: EgButtonGlassIconCount = 1,
): ViewStyle {
  const spacing = mobileTheme.spacing;
  const minSize = egButtonGlassIconMinSize();
  const inset = spacing['spacing-05'] as number;
  const radiusFull = spacing['radius-full'] as number;

  if (iconCount === 2) {
    const padH = spacing['spacing-4'] as number;
    const rowWidth = egButtonGlassDualIconRowWidth();
    return {
      minHeight: minSize,
      minWidth: padH * 2 + rowWidth,
      paddingHorizontal: padH,
      paddingVertical: inset,
      borderRadius: radiusFull,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      overflow: 'hidden',
      alignSelf: 'flex-start',
    };
  }

  return {
    minWidth: minSize,
    minHeight: minSize,
    paddingHorizontal: inset,
    paddingVertical: inset,
    borderRadius: radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
  };
}

/** 文本胶囊 — 与 `EgButtonBase` 同边距；Icon — 见 `resolveEgButtonGlassIconShellStyle`。 */
export function resolveEgButtonGlassShellStyle(
  kind: EgButtonGlassKind,
  size: ControlSize,
  iconCount: EgButtonGlassIconCount = 1,
): ViewStyle {
  if (kind === 'icon') {
    return resolveEgButtonGlassIconShellStyle(iconCount);
  }

  return {
    paddingHorizontal: buttonPaddingHorizontal(size),
    paddingVertical: buttonPaddingVertical(size),
    borderRadius: mobileTheme.spacing['radius-full'] as number,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    minHeight: 0,
  };
}
