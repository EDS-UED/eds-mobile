import { Image, StyleSheet, Text, View, type ViewProps } from 'react-native';

import { EgAtomSvg } from '../../_shared/icon/EgAtomSvg.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { getThemeColors } from '../../../theme/index.js';
import { AVATAR_NATIVE_PALETTE } from '../_shared/avatarPalette.js';
import {
  AVATAR_SIZE_PX,
  avatarHostStyle,
  avatarInitialsLabelStyle,
} from '../_shared/avatarMetrics.js';
import { pickAvatarColorIndex } from '../_shared/pickAvatarColorIndex.js';
import { AVATAR_ROBOT_MARKUP } from '../_shared/avatarRobotMarkup.js';
import { resolveAvatarAssetName } from '../_shared/resolveAvatarAssetName.js';
import { resolveAvatarInitials } from '../_shared/resolveAvatarInitials.js';
import type { EgAvatarProps } from './EgAvatar.types.js';

/** Avatar 本体 — image（`source`）· initials（web3-avatar）· robot（eds-avatar-0）。 */
export function EgAvatar(props: EgAvatarProps & Pick<ViewProps, 'accessibilityLabel'>) {
  const {
    testID,
    name,
    initials,
    size = 'lg',
    variant = 'initials',
    source,
    colorIndex,
    randomColor = false,
    colorSeed,
    label,
    style,
    accessibilityLabel,
  } = props;

  const colors = getThemeColors('light');
  const resolvedInitials = resolveAvatarInitials(name, initials);
  const paletteIndex = pickAvatarColorIndex({
    seed: colorSeed ?? name,
    colorIndex,
    random: randomColor,
  });
  const paletteColor = AVATAR_NATIVE_PALETTE[paletteIndex]!;
  const assetName = resolveAvatarAssetName({
    variant,
    name,
    colorSeed,
    colorIndex,
    randomColor,
  });
  const px = AVATAR_SIZE_PX[size];
  const ariaLabel =
    accessibilityLabel ??
    label ??
    (variant === 'robot' ? 'Robot avatar' : `Avatar ${resolvedInitials}`);

  return (
    <View
      testID={testID ?? `eg-avatar-${assetName}`}
      accessibilityRole="image"
      accessibilityLabel={ariaLabel}
      style={StyleSheet.flatten([avatarHostStyle(size), style])}
    >
      {source != null ? (
        <Image source={source} style={{ width: px, height: px }} resizeMode="cover" />
      ) : variant === 'robot' ? (
        <EgAtomSvg xml={AVATAR_ROBOT_MARKUP} width={px} height={px} />
      ) : (
        <View
          style={[
            styles.initialsHost,
            { backgroundColor: paletteColor.hex },
          ]}
        >
          <View style={styles.initialsPaint}>
            <Text
              style={[
                avatarInitialsLabelStyle(size),
                edsFontStyle('700'),
                { color: resolveColor(colors, 'text-same-white') },
              ]}
            >
              {resolvedInitials}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  initialsHost: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initialsPaint: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
});
