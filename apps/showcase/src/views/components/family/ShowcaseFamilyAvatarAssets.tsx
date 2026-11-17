import {
  AVATAR_NATIVE_PALETTE_SIZE,
  EgAvatar,
  formatAvatarPaletteName,
} from '@eds/mobile-components';

import {
  ShowcaseFamilyAssetGrid,
  type ShowcaseFamilyAssetTile,
} from '@/views/components/family/ShowcaseFamilyAssetGrid';

function buildAvatarAssetTiles(): ShowcaseFamilyAssetTile[] {
  const tiles: ShowcaseFamilyAssetTile[] = [
    {
      key: 'robot',
      label: 'eds-avatar-0',
      detailSlug: 'avatar-preset-0',
      preview: <EgAvatar variant="robot" size="lg" testID="avatar-asset-robot" />,
    },
    {
      key: 'preset-1',
      label: 'eds-avatar-1',
      detailSlug: 'avatar-preset-1',
      preview: (
        <EgAvatar
          variant="initials"
          name="EDS"
          size="lg"
          colorIndex={0}
          testID="avatar-asset-preset-1"
        />
      ),
    },
  ];

  for (let index = 0; index < AVATAR_NATIVE_PALETTE_SIZE; index += 1) {
    tiles.push({
      key: `palette-${index}`,
      label: formatAvatarPaletteName(index),
      preview: (
        <EgAvatar
          variant="initials"
          name="EDS"
          size="lg"
          colorIndex={index}
          testID={`avatar-asset-${index}`}
        />
      ),
    });
  }

  return tiles;
}

const AVATAR_ASSET_TILES = buildAvatarAssetTiles();

export function ShowcaseFamilyAvatarAssets() {
  return <ShowcaseFamilyAssetGrid tiles={AVATAR_ASSET_TILES} />;
}