import type { TextStyle, ViewStyle } from 'react-native';

import { edsFontStyle } from '../../../shared/fontFamily.js';
import {
  presetBar,
  presetBodyMediumHeavy,
  presetBodySmallHeavy,
} from '../../../shared/typographyStyles.js';
import { mobileTheme } from '../../../theme/index.js';
import type { EgAvatarSize } from '../avatar/EgAvatar.types.js';

const spacing = mobileTheme.spacing;
const typeBase = mobileTheme.typography.base;

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

/** 圆内首字 · 保留 typography 行高，垂直居中交给 `EgAvatar` 宿主 flex。 */
function avatarInitialsTextCommon(style: TextStyle): TextStyle {
  return {
    ...style,
    textAlign: 'center',
    includeFontPadding: false,
  };
}

function initialsFace(
  sizeKey: keyof typeof typeBase,
  lineKey: keyof typeof typeBase,
  weightKey: keyof typeof typeBase,
): TextStyle {
  return {
    fontSize: typeBase[sizeKey] as number,
    lineHeight: typeBase[lineKey] as number,
    ...edsFontStyle(String(typeBase[weightKey]) as TextStyle['fontWeight']),
    textTransform: 'uppercase',
  };
}

/**
 * MD · LG · XL · 2XL：`typography-body-small-heavy`。
 * XS：`typography-bar`（10/14 · 与 Tag sm 同链）· SM：`typography-footnote` semibold。
 * 3XL 及以上：`typography-body-medium-heavy`。
 */
export function avatarInitialsLabelStyle(size: EgAvatarSize): TextStyle {
  switch (size) {
    case 'xs':
      return avatarInitialsTextCommon({
        ...presetBar(),
        textTransform: 'uppercase',
      });
    case 'sm':
      return avatarInitialsTextCommon(
        initialsFace('size-footnote', 'line-height-footnote', 'weight-semibold'),
      );
    case 'md':
    case 'lg':
    case 'xl':
    case '2xl':
      return avatarInitialsTextCommon({
        ...presetBodySmallHeavy(),
        textTransform: 'uppercase',
      });
    case '3xl':
    case '4xl':
    case '5xl':
      return avatarInitialsTextCommon({
        ...presetBodyMediumHeavy(),
        textTransform: 'uppercase',
      });
    default: {
      const unreachable: never = size;
      return unreachable;
    }
  }
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
