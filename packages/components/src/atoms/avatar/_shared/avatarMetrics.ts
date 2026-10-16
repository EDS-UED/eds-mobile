import type { TextStyle, ViewStyle } from 'react-native';

import { mobileTheme } from '../../../theme/index.js';
import type { EgAvatarSize } from '../avatar/EgAvatar.types.js';

const spacing = mobileTheme.spacing;

/** Mobile scale semantic — `packages/tokens/spec/scale/semantic.json`。 */
export const AVATAR_SIZE_PX: Record<EgAvatarSize, number> = {
  xs: spacing['avatar-xs'] as number,
  sm: spacing['avatar-sm'] as number,
  md: spacing['avatar-md'] as number,
  lg: spacing['avatar-lg'] as number,
  xl: spacing['avatar-xl'] as number,
  '2xl': spacing['avatar-xl'] as number,
};

/** 与 Desktop Avatar.module.css 一致：2× 字号 + scale(0.5)。 */
export function avatarInitialsLabelStyle(size: EgAvatarSize): TextStyle {
  const fontSize =
    size === 'xs' ? 16 : size === 'sm' ? 20 : 24;

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
