import type { ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { checkboxSize, radioSize, switchThumbSize, switchTrackHeight, switchTrackWidth } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import type { ToggleSize } from '../../../shared/types.js';

export function switchMetrics(size: ToggleSize) {
  return {
    width: switchTrackWidth(size),
    height: switchTrackHeight(size),
    thumb: switchThumbSize(size),
  };
}

export function switchTrackStyle(mode: ThemeMode, size: ToggleSize, on: boolean, disabled?: boolean): ViewStyle {
  const colors = getThemeColors(mode);
  const spacing = mobileTheme.spacing;
  const { height, width } = switchMetrics(size);
  return {
    width,
    height,
    borderRadius: spacing['radius-full'] as number,
    backgroundColor: on
      ? resolveColor(colors, disabled ? 'status-disable-brand' : 'material-brand')
      : resolveColor(colors, 'material-card-deep'),
    justifyContent: 'center',
    paddingHorizontal: spacing['spacing-05'] as number,
    opacity: disabled ? disabledOpacity() : 1,
  };
}

export function switchThumbStyle(mode: ThemeMode, size: ToggleSize): ViewStyle {
  const colors = getThemeColors(mode);
  const { thumb } = switchMetrics(size);
  return {
    width: thumb,
    height: thumb,
    borderRadius: thumb / 2,
    backgroundColor: resolveColor(colors, 'material-same-white'),
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
