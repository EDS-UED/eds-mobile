import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type {
  EgEdsAnimaPageShotPageApi,
  EgEdsAnimaPageShotRootApi,
} from '../shared/motion/EgEdsAnimaPageShot.js';
import { EgPage } from '../templates/page/EgPage.js';
import { EgPageShotContent } from '../templates/page-shot/EgPageShotContent.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

type ScrollOffsetEvent = {
  nativeEvent: { contentOffset: { x: number; y: number } };
};

/**
 * 演示页内容 · 可继续推入的行（滚动区由 `EgPage` 包边距）。
 */
export function PageStackDemoPage({
  mode,
  title,
  backLabel,
  topInset = 0,
  rows,
  onBack,
  onPush,
  footer,
  showHeader = true,
  onScroll: onScrollProp,
  scrollEventThrottle: scrollThrottleProp,
  contentInsetAdjustmentBehavior = topInset > 0 ? 'never' : 'automatic',
  pageShotApi,
  pageShotLayer = 'stack-page',
}: {
  mode: ThemeMode;
  title: string;
  backLabel: string;
  /** 仅 standalone `EgPage` 演示 · `pageShotApi` 存在时由 api 注入 inset。 */
  topInset?: number;
  rows: string[];
  onBack: () => void;
  onPush: (title: string) => void;
  footer?: ReactNode;
  showHeader?: boolean;
  onScroll?: (event: ScrollOffsetEvent) => void;
  scrollEventThrottle?: number;
  contentInsetAdjustmentBehavior?: 'automatic' | 'never';
  /** `EgPageShot` api · `modal-root` 走弹层滚动（下拉关闭）；`stack-page` 标准 `EgPage`（motion-page）。 */
  pageShotApi?: EgEdsAnimaPageShotRootApi | EgEdsAnimaPageShotPageApi;
  pageShotLayer?: 'modal-root' | 'stack-page';
}) {
  const colors = getThemeColors(mode);
  const primary = colors['text-base-primary'] as string;
  const secondary = colors['text-base-secondary'] as string;
  const list = (
    <View style={styles.list}>
      {rows.map((row) => (
        <Pressable
          key={row}
          accessibilityRole="button"
          onPress={() => onPush(row)}
          style={[styles.row, { backgroundColor: colors['box-page-card'] as string }]}
        >
          <Text style={[styles.rowLabel, { color: primary }]}>{row}</Text>
          <Text style={[styles.rowChevron, { color: secondary }]}>›</Text>
        </Pressable>
      ))}
      <Text style={[styles.hint, { color: secondary }]}>
        {showHeader
          ? `点行推入下一页 · 点「${backLabel.replace('‹ ', '')}」或自左缘向右侧滑返回（跟手，松手按速度决定返回 / 复位）。`
          : '点行推入下一页 · 点顶栏返回或拖拽返回。'}
      </Text>
      {footer}
    </View>
  );
  if (!showHeader) {
    if (pageShotApi && pageShotLayer === 'modal-root') {
      return (
        <EgPageShotContent
          mode={mode}
          api={pageShotApi}
          nativeScrollEdge={false}
          onScroll={onScrollProp}
          scrollEventThrottle={scrollThrottleProp}
        >
          {list}
        </EgPageShotContent>
      );
    }
    if (pageShotApi && pageShotLayer === 'stack-page') {
      return (
        <EgPage
          mode={mode}
          topInset={pageShotApi.topInset}
          scrollTopInset={pageShotApi.scrollTopInset}
          contentInsetAdjustmentBehavior={pageShotApi.contentInsetAdjustmentBehavior}
          onScroll={onScrollProp}
          scrollEventThrottle={scrollThrottleProp}
        >
          {list}
        </EgPage>
      );
    }
    return (
      <EgPage
        mode={mode}
        topInset={topInset}
        scrollTopInset={topInset > 0 ? topInset : undefined}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        onScroll={onScrollProp}
        scrollEventThrottle={scrollThrottleProp}
      >
        {list}
      </EgPage>
    );
  }
  return (
    <EgPage mode={mode} contentInsetAdjustmentBehavior="automatic">
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backHit}>
        <Text style={[styles.back, { color: colors.brand as string }]}>{backLabel}</Text>
      </Pressable>
      <Text style={[styles.largeTitle, { color: primary }]}>{title}</Text>
      {list}
    </EgPage>
  );
}

const spacing = mobileTheme.spacing as Record<string, number>;

const styles = StyleSheet.create({
  backHit: {
    alignSelf: 'flex-start',
    paddingVertical: spacing['spacing-2'] ?? 8,
    paddingRight: spacing['spacing-4'] ?? 16,
  },
  back: {
    fontSize: 17,
    lineHeight: 22,
    ...edsFontStyle('500'),
  },
  largeTitle: {
    fontSize: 34,
    lineHeight: 41,
    marginTop: spacing['spacing-1'] ?? 4,
    marginBottom: spacing['spacing-4'] ?? 16,
    ...edsFontStyle('700'),
  },
  list: {
    gap: spacing['spacing-2'] ?? 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing['spacing-4'] ?? 16,
    paddingVertical: spacing['spacing-4'] ?? 16,
    borderRadius: spacing['radius-lg'] ?? 16,
    borderCurve: 'continuous',
  },
  rowLabel: {
    fontSize: 17,
    lineHeight: 22,
    ...edsFontStyle('500'),
  },
  rowChevron: {
    fontSize: 20,
    lineHeight: 22,
    ...edsFontStyle('400'),
  },
  hint: {
    marginTop: spacing['spacing-2'] ?? 8,
    fontSize: 13,
    lineHeight: 18,
    ...edsFontStyle('400'),
  },
});