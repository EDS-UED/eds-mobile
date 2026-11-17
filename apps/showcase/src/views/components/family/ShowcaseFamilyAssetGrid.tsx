import { router } from 'expo-router';
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import { EG_PAGE_CONTENT_PADDING_HORIZONTAL } from '@eds/mobile-components';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { docSectionTitlePaddingLeft } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseDocSectionTitleStyle } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseCardChromeStyle, showcaseTheme as theme } from '@/views/shared/showcaseTheme';

import { SHOWCASE_FAMILY_SECTION_ASSETS } from '@/data/components/componentFamilyListModel';

const GRID_GAP = theme.layout.tokenItemGap;

export type ShowcaseFamilyAssetTile = {
  key: string;
  label: string;
  detailSlug?: string;
  preview: ReactNode;
};

type ShowcaseFamilyAssetGridProps = {
  tiles: ShowcaseFamilyAssetTile[];
  /** 默认「资产」；`false` 则不渲染主标题。 */
  sectionTitle?: string | false;
  /** 分组副标题（Icon · Crypto）。 */
  groupTitle?: string;
};

function AssetCard({
  tile,
  colors,
  cellWidth,
}: {
  tile: ShowcaseFamilyAssetTile;
  colors: ReturnType<typeof useShowcaseColors>;
  cellWidth: number;
}) {
  const card = (
    <View
      style={[
        styles.cell,
        theme.blockRadius,
        showcaseCardChromeStyle(colors),
        { width: cellWidth },
      ]}
    >
      <View style={styles.previewSlot}>{tile.preview}</View>
      <Text
        style={[styles.label, { color: colors['text-base-secondary'] as string }]}
        numberOfLines={2}
      >
        {tile.label}
      </Text>
    </View>
  );

  if (!tile.detailSlug) {
    return card;
  }

  return (
    <Pressable
      accessibilityRole="button"
      style={{ width: cellWidth }}
      onPress={() => router.push(`/(components)/detail/${tile.detailSlug}`)}
    >
      {card}
    </Pressable>
  );
}

export function useShowcaseFamilyAssetCellWidth(): {
  cellWidth: number;
  onGridLayout: (width: number) => void;
} {
  const { width: windowWidth } = useWindowDimensions();
  const pagePad = EG_PAGE_CONTENT_PADDING_HORIZONTAL as number;
  const estimatedGridWidth = windowWidth - pagePad * 2;
  const [gridWidth, setGridWidth] = useState(estimatedGridWidth);
  const resolvedWidth = gridWidth > 0 ? gridWidth : estimatedGridWidth;
  return { cellWidth: (resolvedWidth - GRID_GAP) / 2, onGridLayout: setGridWidth };
}

/** 族页「资产」— 独立小卡 · 两列 · gap spacing-4（与 Avatar 同构）。 */
export function ShowcaseFamilyAssetGrid({
  tiles,
  sectionTitle,
  groupTitle,
}: ShowcaseFamilyAssetGridProps) {
  const colors = useShowcaseColors();
  const { cellWidth, onGridLayout } = useShowcaseFamilyAssetCellWidth();

  if (tiles.length === 0) {
    return null;
  }

  const resolvedSectionTitle =
    sectionTitle === false ? null : (sectionTitle ?? SHOWCASE_FAMILY_SECTION_ASSETS);

  return (
    <View style={styles.wrap}>
      {resolvedSectionTitle ? (
        <Text style={showcaseDocSectionTitleStyle(colors)}>{resolvedSectionTitle}</Text>
      ) : null}
      {groupTitle ? (
        <Text style={[styles.groupTitle, { color: colors['text-base-secondary'] as string }]}>
          {groupTitle}
        </Text>
      ) : null}
      <View
        style={[styles.grid, { gap: GRID_GAP }]}
        onLayout={(event) => onGridLayout(event.nativeEvent.layout.width)}
      >
        {tiles.map((tile) => (
          <View key={tile.key} style={{ width: cellWidth }}>
            <AssetCard tile={tile} colors={colors} cellWidth={cellWidth} />
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
  },
  groupTitle: {
    ...theme.font.rowTitle,
    paddingLeft: docSectionTitlePaddingLeft,
    marginBottom: theme.layout.docSectionTitleCardGap,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: '100%',
    alignItems: 'flex-start',
  },
  cell: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: theme.layout.cardPaddingVertical,
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    gap: theme.spacing['spacing-3'] as number,
  },
  previewSlot: {
    minHeight: 56,
    minWidth: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...theme.font.rowHint,
    textAlign: 'center',
  },
});