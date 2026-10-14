import type { TextStyle, ViewStyle } from 'react-native';
import { getThemeColors, type ThemeMode } from '../../../theme/index.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { disabledOpacity } from '../../../shared/themeScalars.js';
import { linkTypography } from '../../../shared/typographyStyles.js';
import type { ControlSize } from '../../../shared/types.js';

export function createLinkButtonStyles(
  mode: ThemeMode,
  size: Extract<ControlSize, 'lg' | 'md' | 'sm'>,
  disabled?: boolean,
  pressed?: boolean,
): { container: ViewStyle; label: TextStyle } {
  const colors = getThemeColors(mode);
  return {
    container: {
      alignSelf: 'flex-start',
      opacity: disabled ? disabledOpacity() : 1,
    },
    label: {
      ...linkTypography(size),
      color: resolveColor(colors, disabled ? 'text-base-quaternary' : 'text-brand'),
      textDecorationLine: pressed ? 'underline' : 'none',
    },
  };
}
