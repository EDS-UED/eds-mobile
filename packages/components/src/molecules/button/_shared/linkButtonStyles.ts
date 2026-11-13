import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, type ThemeMode } from '../../../theme/index.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { linkTypography } from '../../../shared/typographyStyles.js';
import type { ButtonTone, ControlSize } from '../../../shared/types.js';

export type EgLinkButtonTone = ButtonTone | 'option';

export function normalizeEgLinkButtonTone(tone?: EgLinkButtonTone): ButtonTone {
  if (!tone || tone === 'brand') {
    return 'brand';
  }
  if (tone === 'option') {
    return 'subtle';
  }
  return tone;
}

function resolveLinkLabelColor(
  colors: Record<string, string>,
  tone: ButtonTone,
  disabled?: boolean,
): string {
  if (disabled) {
    return resolveColor(colors, 'text-base-quaternary');
  }
  switch (tone) {
    case 'danger':
      return resolveColor(colors, 'status-danger');
    case 'decor':
      return resolveColor(colors, 'text-decor');
    case 'subtle':
      return resolveColor(colors, 'text-base-primary');
    case 'sameWhite':
      return resolveColor(colors, 'text-same-white');
    case 'brand':
    default:
      return resolveColor(colors, 'text-brand');
  }
}

export function createLinkButtonStyles(
  mode: ThemeMode,
  size: Extract<ControlSize, 'lg' | 'md' | 'sm'>,
  tone: ButtonTone = 'brand',
  disabled?: boolean,
  _pressed?: boolean,
): { container: ViewStyle; label: TextStyle } {
  const colors = getThemeColors(mode);
  const color = resolveLinkLabelColor(colors, tone, disabled);
  return {
    container: {
      alignSelf: 'flex-start',
      opacity: disabled ? disabledOpacity() : 1,
    },
    label: {
      ...linkTypography(size),
      color,
      textDecorationLine: 'none',
    },
  };
}
