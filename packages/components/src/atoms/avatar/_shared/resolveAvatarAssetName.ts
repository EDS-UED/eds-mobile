import { AVATAR_ROBOT_ASSET_NAME, formatAvatarPaletteName } from './avatarPalette.js';
import { pickAvatarColorIndex } from './pickAvatarColorIndex.js';

/** Figma 资产名：`eds-avatar-0` 或 `web3-avatar-1` … `web3-avatar-20`。 */
export function resolveAvatarAssetName(options: {
  variant?: 'initials' | 'robot';
  name?: string;
  colorSeed?: string;
  colorIndex?: number;
  randomColor?: boolean;
}): string {
  if (options.variant === 'robot') {
    return AVATAR_ROBOT_ASSET_NAME;
  }

  const paletteIndex = pickAvatarColorIndex({
    seed: options.colorSeed ?? options.name,
    colorIndex: options.colorIndex,
    random: options.randomColor,
  });

  return formatAvatarPaletteName(paletteIndex);
}
