import type { TextStyle, ViewStyle } from 'react-native';

import { presetBodyMediumHeavy } from '../../../shared/typographyStyles.js';
import { mobileTheme } from '../../../theme/index.js';
import type { EgAvatarSize } from '../avatar/EgAvatar.types.js';

const AVATAR_INITIALS_BODY_MEDIUM_HEAVY: EgAvatarSize[] = ['xl', '2xl', '3xl', '4xl', '5xl'];

const spacing = mobileTheme.spacing;

/** Mobile scale semantic — `packages/tokens/spec/scale/semantic.json`。 */
export const AVATAR_SIZE_PX: Record<EgAvatarSize, number> = {
  xs: spacing['avatar-xs'] as number,
  sm: spacing['avatar-sm'] as number,
  md: spacing['avatar-md'] as number,
  lg: spacing['avatar-lg'] as number,
  xl: spacing['avatar-xl'] as number,
  '2xl': spacing['avatar-2xl'] as number,
  '3xl': spacing['avatar-3xl'] as number,
  '4xl': spacing['avatar-4xl'] as number,
  '5xl': spacing['avatar-5xl'] as number,
};

/**
 * xs～lg：与 Desktop 一致 · 2× 字号 + scale(0.5)。
 * xl 及更大：`typography-body-medium-heavy`（17 / 24 · weight-semibold）。
 */
export function avatarInitialsLabelStyle(size: EgAvatarSize): TextStyle {
  if (AVATAR_INITIALS_BODY_MEDIUM_HEAVY.includes(size)) {
    return {
      ...presetBodyMediumHeavy(),
      textTransform: 'uppercase',
    };
  }
  const fontSize = size === 'xs' ? 16 : size === 'sm' ? 20 : 24;

  return {
    fontSize,
    fontWeight: '700',
    lineHeight: fontSize,
    textTransform: 'uppercase',
    transform: [{ scale: 0.5 }],
  };
}

export function avatarHostStyle(size: EgAvatarSize): ViewStyle {
  const px = AVATAR_SIZE_PX[size];
  return {
    width: px,
    height: px,
    borderRadius: spacing['radius-full'] as number,
    overflow: 'hidden',
  };
}
