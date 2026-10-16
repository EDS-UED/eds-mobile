import type { ViewProps } from 'react-native';

import { EgAvatar } from '../avatar/EgAvatar.js';
import type { EgAvatarPreset1Props } from './EgAvatarPreset1.types.js';

/** Figma eds-avatar-1 — 首字 + web3 原色盘。 */
export function EgAvatarPreset1(props: EgAvatarPreset1Props & Pick<ViewProps, 'style'>) {
  const {
    testID,
    name,
    initials,
    size,
    colorIndex,
    randomColor,
    colorSeed,
    label,
    style,
  } = props;

  return (
    <EgAvatar
      testID={testID ?? 'avatar-preset-1'}
      variant="initials"
      name={name}
      initials={initials}
      size={size ?? 'lg'}
      colorIndex={colorIndex}
      randomColor={randomColor}
      colorSeed={colorSeed}
      label={label}
      style={style}
    />
  );
}
