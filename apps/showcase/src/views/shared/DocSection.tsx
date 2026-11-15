import type { PropsWithChildren } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';

import {
  showcaseDocSectionLayout,
  showcaseDocSectionTitleStyle,
} from './showcaseDocSectionLayout';
import {
  showcasePageCardSurface,
  showcaseCardChromeStyle,
  showcaseTheme as theme,
} from './showcaseTheme';

type DocSectionProps = PropsWithChildren<{
  title: string;
  /** 预览 — 外层仍卡片；内容区左右贴齐卡片内缘（把卡片当模拟屏）。 */
  previewScreenFrame?: boolean;
  /** @deprecated 用默认单卡 + `cardPadding="none"` 包 inset 列表 */
  slotStack?: boolean;
  /** 定制 — 内容自包 `EgItemGroup`，外层不叠浅底卡片内边距。 */
  egItemGroupFrame?: boolean;
  /** 卡内边距 — 默认 spacing-5×4；`none` 供卡内分行列表。 */
  cardPadding?: 'default' | 'none';
}>;

/** 详情文档块 — 标题 + 单块内容卡片（定制面板等）。 */
export function DocSection({
  title,
  children,
  previewScreenFrame = false,
  slotStack = false,
  egItemGroupFrame = false,
  cardPadding = 'default',
}: DocSectionProps) {
  const colors = useShowcaseColors();
  const chrome =
    previewScreenFrame || (!slotStack && !egItemGroupFrame)
      ? previewScreenFrame
        ? showcasePageCardSurface(colors['box-page'] as string)
        : showcaseCardChromeStyle(colors)
      : null;
  const paddingOff = cardPadding === 'none' || previewScreenFrame || slotStack || egItemGroupFrame;

  return (
    <View style={showcaseDocSectionLayout.block}>
      <Text style={showcaseDocSectionTitleStyle(colors)}>{title}</Text>
      <View
        style={[
          showcaseDocSectionLayout.cardShell,
          chrome,
          previewScreenFrame ? styles.cardPreviewScreenFrame : null,
          slotStack ? styles.cardSlotStack : null,
          egItemGroupFrame ? styles.cardEgItemGroupFrame : null,
          paddingOff ? styles.cardPaddingNone : styles.cardPaddingDefault,
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  cardPaddingDefault: {
    paddingHorizontal: theme.layout.cardPaddingHorizontal,
    paddingVertical: theme.layout.cardPaddingVertical,
  },
  cardPreviewScreenFrame: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    overflow: 'hidden',
  },
  cardSlotStack: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    borderRadius: 0,
    overflow: 'visible',
  },
  cardEgItemGroupFrame: {
    paddingHorizontal: 0,
    paddingVertical: 0,
    backgroundColor: 'transparent',
    overflow: 'visible',
  },
  cardPaddingNone: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
});