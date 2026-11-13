import type { ViewStyle } from 'react-native';
import {
  buttonPaddingHorizontal,
  buttonPaddingVertical,
} from '../../../../shared/controlMetrics.js';
import type { ControlSize } from '../../../../shared/types.js';
import { mobileTheme } from '../../../../theme/index.js';
import type { EgButtonGlassIconCount, EgButtonGlassKind } from '../EgButtonGlass.types.js';

/** Icon 胶囊内边距 — `spacing-1`（4px）。 */
export function egButtonGlassInsetPx(): number {
  return mobileTheme.spacing['spacing-1'] as number;
}

/** 两颗独立玻璃钮（2 拆分）间距 — `spacing-3`（12px）。 */
export function egButtonGlassSplitPairGapPx(): number {
  return mobileTheme.spacing['spacing-3'] as number;
}

/** 双 icon / icon+头像胶囊 — 左右内边距 `spacing-4`。 */
export function egButtonGlassDualPaddingHorizontalPx(): number {
  return mobileTheme.spacing['spacing-4'] as number;
}

/** 双列胶囊水平内边距 — 右侧为头像时不再做 `spacing-4` 右边距补偿。 */
export function resolveEgButtonGlassDualCapsuleHorizontalPadding(rightIsAvatar: boolean): {
  paddingLeft: number;
  paddingRight: number;
} {
  const padH = egButtonGlassDualPaddingHorizontalPx();
  const inset = egButtonGlassInsetPx();
  if (rightIsAvatar) {
    return { paddingLeft: padH, paddingRight: inset };
  }
  return { paddingLeft: padH, paddingRight: padH };
}

/** iOS 工具栏控件最小边长 — spacing-10 + spacing-1 = 44px。 */
export function egButtonGlassIconMinSize(): number {
  const spacing = mobileTheme.spacing;
  return (spacing['spacing-10'] as number) + (spacing['spacing-1'] as number);
}

/** 头像槽内容直径 — 44 − 2×`spacing-1` → `EgAvatar size="lg"`（36px）。 */
export function egButtonGlassAvatarSlotInnerPx(): number {
  const pad = egButtonGlassInsetPx();
  return egButtonGlassIconMinSize() - pad * 2;
}

function egButtonGlassIconSymbolPx(): number {
  return mobileTheme.spacing['symbol-md'] as number;
}

/** 双 symbol 行内容宽 — 2×symbol-md + spacing-4。 */
export function egButtonGlassDualIconRowWidth(): number {
  const spacing = mobileTheme.spacing;
  const symbol = egButtonGlassIconSymbolPx();
  const gap = spacing['spacing-4'] as number;
  return symbol + gap + symbol;
}

/** 左 symbol + spacing-4 + avatar-lg — 双 icon 右侧换头像。 */
export function egButtonGlassIconPlusSlotRowWidth(): number {
  const spacing = mobileTheme.spacing;
  const symbol = egButtonGlassIconSymbolPx();
  const gap = spacing['spacing-4'] as number;
  const avatar = spacing['avatar-lg'] as number;
  return symbol + gap + avatar;
}

export function egButtonGlassAvatarInsetPx(): number {
  return egButtonGlassInsetPx();
}

export function egButtonGlassAvatarElementMarginPx(): number {
  return 0;
}

/** Icon 胶囊 — 仅 icon 路径；内边距 `spacing-1`。 */
export function resolveEgButtonGlassIconShellStyle(
  iconCount: EgButtonGlassIconCount = 1,
  rightIsAvatar = false,
): ViewStyle {
  const spacing = mobileTheme.spacing;
  const minSize = egButtonGlassIconMinSize();
  const inset = egButtonGlassInsetPx();
  const radiusFull = spacing['radius-full'] as number;

  if (iconCount === 2) {
    const { paddingLeft, paddingRight } = resolveEgButtonGlassDualCapsuleHorizontalPadding(rightIsAvatar);
    const rowWidth = rightIsAvatar
      ? egButtonGlassIconPlusSlotRowWidth()
      : egButtonGlassDualIconRowWidth();
    return {
      minHeight: minSize,
      minWidth: paddingLeft + paddingRight + rowWidth,
      paddingLeft,
      paddingRight,
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
    width: minSize,
    height: minSize,
    minWidth: minSize,
    minHeight: minSize,
    maxWidth: minSize,
    maxHeight: minSize,
    paddingHorizontal: inset,
    paddingVertical: inset,
    borderRadius: radiusFull,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  };
}

/** 文本胶囊 — 与 `EgButtonBase` 同边距（与 icon 的 spacing-1 无关）。 */
export function resolveEgButtonGlassTextShellStyle(size: ControlSize): ViewStyle {
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

export function resolveEgButtonGlassShellStyle(
  kind: EgButtonGlassKind,
  size: ControlSize,
  iconCount: EgButtonGlassIconCount = 1,
  rightIsAvatar = false,
): ViewStyle {
  if (kind === 'icon') {
    return resolveEgButtonGlassIconShellStyle(iconCount, rightIsAvatar);
  }
  return resolveEgButtonGlassTextShellStyle(size);
}

/**
 * iOS 26+ — 内容区布局（**不**叠 RN `spacing-1` / `spacing-4` / EgButton 文本 padding；材质 inset 由系统 GlassView 承担）。
 */
export function resolveEgButtonGlassNativePressableStyle(
  kind: EgButtonGlassKind,
  size: ControlSize,
  iconCount: EgButtonGlassIconCount = 1,
  _rightIsAvatar = false,
): ViewStyle {
  const minSize = egButtonGlassIconMinSize();

  if (kind === 'text') {
    return {
      paddingHorizontal: buttonPaddingHorizontal(size),
      paddingVertical: buttonPaddingVertical(size),
      alignItems: 'center',
      justifyContent: 'center',
      alignSelf: 'center',
    };
  }

  if (iconCount === 2) {
    return {
      alignSelf: 'stretch',
      width: '100%',
      minHeight: minSize,
      alignItems: 'center',
      justifyContent: 'center',
    };
  }

  return {
    width: '100%',
    height: '100%',
    minHeight: minSize,
    alignItems: 'center',
    justifyContent: 'center',
  };
}

/**
 * iOS 26+ — 外框几何（圆 / 胶囊）；双 icon 宽度 = 内容行 + 左右各 `spacing-1` 呼吸。
 */
export function resolveEgButtonGlassNativeContainerStyle(
  kind: EgButtonGlassKind,
  size: ControlSize,
  iconCount: EgButtonGlassIconCount = 1,
  rightIsAvatar = false,
): ViewStyle {
  const spacing = mobileTheme.spacing;
  const minSize = egButtonGlassIconMinSize();
  const radiusFull = spacing['radius-full'] as number;
  const systemInset = egButtonGlassInsetPx();

  if (kind === 'text') {
    return {
      borderRadius: radiusFull,
      alignSelf: 'flex-start',
      flexShrink: 0,
    };
  }

  if (iconCount === 2) {
    const rowWidth = rightIsAvatar
      ? egButtonGlassIconPlusSlotRowWidth()
      : egButtonGlassDualIconRowWidth();
    return {
      height: minSize,
      minHeight: minSize,
      minWidth: rowWidth + systemInset * 2,
      borderRadius: radiusFull,
      alignSelf: 'flex-start',
      flexShrink: 0,
    };
  }

  return {
    width: minSize,
    height: minSize,
    minWidth: minSize,
    minHeight: minSize,
    borderRadius: radiusFull,
    alignSelf: 'flex-start',
    flexShrink: 0,
  };
}
