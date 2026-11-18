import type { ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { checkboxSize, radioSize, switchThumbSize, switchTrackHeight, switchTrackWidth } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import type { ToggleSize } from '../../../shared/types.js';

function switchTrackInset(): number {
  return mobileTheme.spacing['spacing-05'] as number;
}

/** 轨 — 宽/高固定 · knob 宽 scale 三档 · 高 = 轨高 − 上下 inset（胶囊，非正圆）。 */
export function switchTrackLayout(size: ToggleSize) {
  const inset = switchTrackInset();
  const thumb = switchThumbSize(size);
  const width = switchTrackWidth(size);
  const height = switchTrackHeight(size);
  const thumbHeight = Math.max(0, height - inset * 2);
  return { width, height, thumb, thumbHeight, inset };
}

export function switchMetrics(size: ToggleSize) {
  const layout = switchTrackLayout(size);
  return {
    width: layout.width,
    height: layout.height,
    thumb: layout.thumb,
  };
}

export function switchTrackStyle(mode: ThemeMode, size: ToggleSize, on: boolean, disabled?: boolean): ViewStyle {
  const colors = getThemeColors(mode);
  const spacing = mobileTheme.spacing;
  const { width, height, inset } = switchTrackLayout(size);
  return {
    width,
    height,
    borderRadius: spacing['radius-full'] as number,
    backgroundColor: on
      ? resolveColor(colors, disabled ? 'status-disable-brand' : 'material-brand')
      : resolveColor(colors, 'material-card-deep'),
    alignItems: 'flex-start',
    justifyContent: 'center',
    paddingHorizontal: inset,
    paddingVertical: inset,
    opacity: disabled ? disabledOpacity() : 1,
  };
}

export function switchThumbStyle(mode: ThemeMode, size: ToggleSize): ViewStyle {
  const colors = getThemeColors(mode);
  const spacing = mobileTheme.spacing;
  const { thumb, thumbHeight } = switchTrackLayout(size);
  return {
    width: thumb,
    height: thumbHeight,
    borderRadius: spacing['radius-full'] as number,
    backgroundColor: resolveColor(colors, 'material-same-white'),
  };
}

export function switchThumbTravel(size: ToggleSize): number {
  const { width, thumb, inset } = switchTrackLayout(size);
  return Math.max(0, width - thumb - inset * 2);
}

export function checkboxStyleBase(size: ToggleSize = 'md'): ViewStyle {
  const dimension = checkboxSize(size);
  return {
    width: dimension,
    height: dimension,
    borderRadius: mobileTheme.spacing['radius-xs'] as number,
    borderWidth: mobileTheme.spacing['stroke-md'] as number,
    alignItems: 'center',
    justifyContent: 'center',
  };
}

export function decideStyleBase(size: ToggleSize = 'md'): ViewStyle {
  return {
    ...checkboxStyleBase(size),
    borderRadius: mobileTheme.spacing['radius-sm'] as number,
  };
}

export function radioStyleBase(size: ToggleSize = 'md'): ViewStyle {
  const dimension = radioSize(size);
  return {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    borderWidth: mobileTheme.spacing['stroke-lg'] as number,
    alignItems: 'center',
    justifyContent: 'center',
  };
}

export function checkboxStyle(
  mode: ThemeMode,
  checked: boolean,
  disabled?: boolean,
  size: ToggleSize = 'md',
): ViewStyle {
  const colors = getThemeColors(mode);
  const dimension = checkboxSize(size);
  return {
    width: dimension,
    height: dimension,
    borderRadius: mobileTheme.spacing['radius-xs'] as number,
    borderWidth: mobileTheme.spacing['stroke-md'] as number,
    borderColor: checked
      ? resolveColor(colors, 'material-brand')
      : resolveColor(colors, 'stroke-base-quaternary'),
    backgroundColor: checked ? resolveColor(colors, 'material-brand') : resolveColor(colors, 'material-hide'),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? disabledOpacity() : 1,
  };
}

export function radioStyle(
  mode: ThemeMode,
  checked: boolean,
  disabled?: boolean,
  size: ToggleSize = 'md',
): ViewStyle {
  const colors = getThemeColors(mode);
  const dimension = radioSize(size);
  return {
    width: dimension,
    height: dimension,
    borderRadius: dimension / 2,
    borderWidth: mobileTheme.spacing['stroke-lg'] as number,
    borderColor: checked
      ? resolveColor(colors, 'material-brand')
      : resolveColor(colors, 'stroke-base-quaternary'),
    alignItems: 'center',
    justifyContent: 'center',
    opacity: disabled ? disabledOpacity() : 1,
  };
}

export function radioDotStyle(mode: ThemeMode, size: ToggleSize = 'md'): ViewStyle {
  const dot = radioSize(size) * (mobileTheme.scale['scale-05'] as number);
  return {
    width: dot,
    height: dot,
    borderRadius: dot / 2,
    backgroundColor: resolveColor(getThemeColors(mode), 'material-brand'),
  };
}

export function decideStyle(
  mode: ThemeMode,
  decided: boolean,
  disabled?: boolean,
  size: ToggleSize = 'md',
): ViewStyle {
  return {
    ...checkboxStyle(mode, decided, disabled, size),
    borderRadius: mobileTheme.spacing['radius-sm'] as number,
  };
}
