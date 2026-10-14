import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../../theme/index.js';
import { buttonPaddingHorizontal, buttonPaddingVertical } from '../../../shared/controlMetrics.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { buttonTypography } from '../../../shared/typographyStyles.js';
import type { ButtonFigmaType, ButtonTone, ControlSize } from '../../../shared/types.js';

export type ButtonVisualState = {
  tone: ButtonTone;
  figmaType: ButtonFigmaType;
  size: ControlSize;
  mode: ThemeMode;
  disabled?: boolean;
  loading?: boolean;
  pressed?: boolean;
  active?: boolean;
};

function mapFigmaTypeToVariant(figmaType: ButtonFigmaType): 'solid' | 'soft' | 'text' {
  if (figmaType === 'primary') return 'solid';
  if (figmaType === 'secondary') return 'soft';
  return 'text';
}

export function createButtonStyles(state: ButtonVisualState): { container: ViewStyle; label: TextStyle } {
  const colors = getThemeColors(state.mode);
  const spacing = mobileTheme.spacing;
  const variant = mapFigmaTypeToVariant(state.figmaType);
  const height = spacing[`button-${state.size}`] as number;
  const paddingHorizontal = buttonPaddingHorizontal(state.size);
  const typography = buttonTypography(state.size);

  const label: TextStyle = {
    ...typography,
    textAlign: 'center',
  };

  const container: ViewStyle = {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing['spacing-2'] as number,
    minHeight: height,
    maxHeight: height,
    paddingHorizontal,
    borderRadius: spacing['radius-full'] as number,
    borderWidth: spacing['stroke-sm'] as number,
    borderColor: 'transparent',
  };

  if (state.disabled && !state.loading) {
    if (state.tone === 'brand' && variant === 'solid') {
      container.backgroundColor = resolveColor(colors, 'status-success-weaken');
      label.color = resolveColor(colors, 'text-base-quaternary');
      return { container, label };
    }
    container.backgroundColor = resolveColor(colors, 'material-card-moderate');
    label.color = resolveColor(colors, 'text-base-quaternary');
    return { container, label };
  }

  if (state.loading) {
    applyToneColors(state, colors, variant, container, label, false);
    return { container, label };
  }

  applyToneColors(state, colors, variant, container, label, Boolean(state.pressed || state.active));
  return { container, label };
}

function applyToneColors(
  state: ButtonVisualState,
  colors: Record<string, string>,
  variant: 'solid' | 'soft' | 'text',
  container: ViewStyle,
  label: TextStyle,
  pressed: boolean,
) {
  const { tone } = state;

  if (tone === 'brand') {
    if (variant === 'solid') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap-brand')
        : resolveColor(colors, 'material-brand');
      label.color = pressed
        ? resolveColor(colors, 'text-same-white-weaken')
        : resolveColor(colors, 'text-same-white');
      return;
    }
    if (variant === 'soft') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap')
        : resolveColor(colors, 'material-card-moderate');
      label.color = resolveColor(colors, 'text-brand');
      return;
    }
    container.backgroundColor = pressed
      ? resolveColor(colors, 'material-card-moderate')
      : resolveColor(colors, 'material-hide');
    label.color = resolveColor(colors, 'text-brand');
    if (state.active) {
      container.backgroundColor = resolveColor(colors, 'event-focus-brand');
    }
    return;
  }

  if (tone === 'danger') {
    if (variant === 'solid') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap-danger')
        : resolveColor(colors, 'status-danger');
      label.color = pressed
        ? resolveColor(colors, 'text-same-white-weaken')
        : resolveColor(colors, 'text-same-white');
      return;
    }
    if (variant === 'soft') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap')
        : resolveColor(colors, 'material-card-moderate');
      label.color = resolveColor(colors, 'status-danger');
      return;
    }
    container.backgroundColor = pressed
      ? resolveColor(colors, 'material-card-moderate')
      : resolveColor(colors, 'material-hide');
    label.color = resolveColor(colors, 'status-danger');
    return;
  }

  if (tone === 'decor') {
    if (variant === 'solid') {
      container.backgroundColor = resolveColor(colors, 'material-decor');
      label.color = pressed
        ? resolveColor(colors, 'text-face-secondary')
        : resolveColor(colors, 'text-face-primary');
      return;
    }
    if (variant === 'soft') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap')
        : resolveColor(colors, 'material-card-moderate');
      label.color = resolveColor(colors, 'material-decor');
      return;
    }
    container.backgroundColor = pressed
      ? resolveColor(colors, 'material-card-moderate')
      : resolveColor(colors, 'material-hide');
    label.color = resolveColor(colors, 'material-decor');
    return;
  }

  if (tone === 'subtle') {
    if (variant === 'solid') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap')
        : resolveColor(colors, 'material-card-moderate');
      label.color = pressed
        ? resolveColor(colors, 'text-base-secondary')
        : resolveColor(colors, 'text-base-primary');
      if (state.active) {
        container.backgroundColor = resolveColor(colors, 'event-focus');
        label.color = resolveColor(colors, 'text-base-secondary');
      }
      return;
    }
    if (variant === 'soft') {
      container.backgroundColor = pressed
        ? resolveColor(colors, 'event-tap')
        : resolveColor(colors, 'material-card-moderate');
      label.color = resolveColor(colors, 'text-base-primary');
      return;
    }
    container.backgroundColor = pressed
      ? resolveColor(colors, 'material-card-moderate')
      : resolveColor(colors, 'material-hide');
    label.color = resolveColor(colors, 'text-base-primary');
    return;
  }

  if (variant === 'solid') {
    container.backgroundColor = resolveColor(colors, 'material-same-white');
    label.color = resolveColor(colors, 'text-same-black');
    return;
  }
  if (variant === 'soft') {
    container.backgroundColor = pressed
      ? resolveColor(colors, 'event-tap')
      : resolveColor(colors, 'material-card-moderate');
    label.color = resolveColor(colors, 'text-same-white');
    return;
  }
  container.backgroundColor = pressed
    ? resolveColor(colors, 'material-card-moderate')
    : resolveColor(colors, 'material-hide');
  label.color = resolveColor(colors, 'text-same-white');
}

export function spinnerColor(state: ButtonVisualState): string {
  const colors = getThemeColors(state.mode);
  const variant = mapFigmaTypeToVariant(state.figmaType);
  if (state.disabled) return resolveColor(colors, 'text-base-quaternary');
  if (variant === 'solid') return resolveColor(colors, 'text-same-white');
  if (state.tone === 'danger') return resolveColor(colors, 'status-danger');
  if (state.tone === 'decor') return resolveColor(colors, 'material-decor');
  return resolveColor(colors, 'text-brand');
}
