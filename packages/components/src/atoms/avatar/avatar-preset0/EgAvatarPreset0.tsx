import type { ViewProps } from 'react-native';

import { EgAvatar } from '../avatar/EgAvatar.js';
import type { EgAvatarPreset0Props } from './EgAvatarPreset0.types.js';

/** Figma eds-avatar-0 — 机器人头像。 */
export function EgAvatarPreset0(props: EgAvatarPreset0Props & Pick<ViewProps, 'style'>) {
  const { testID, size, style } = props;

  return (
    <EgAvatar
      testID={testID ?? 'avatar-preset-0'}
      variant="robot"
      size={size ?? 'lg'}
      style={style}
    />
  );
}
