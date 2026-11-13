import type { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { useEgNavBarScroll } from '../organisms/tab-bar/nav-bar/useEgNavBarScroll.js';
import { edsFontStyle } from '../shared/fontFamily.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../theme/index.js';

/**
 * 演示页内容 · 可继续推入的行。
 * `showHeader`（默认 true）自绘返回 + 大标题；false 时顶栏交给 NavBar（系统栏 / EgNavBar）：
 * `topInset` > 0 按栏底留白（RN 栏），否则滚动区由系统自动避让（系统栏）。
 */
export function PageStackDemoPage({
  mode,
  title,
  backLabel,
  topInset,
  rows,
  onBack,
  onPush,
  footer,
  showHeader = true,
}: {
  mode: ThemeMode;
  title: string;
  backLabel: string;
  topInset: number;
  rows: string[];
  onBack: () => void;
  onPush: (title: string) => void;
  footer?: ReactNode;
  showHeader?: boolean;
}) {
  const colors = getThemeColors(mode);
  const { onScroll, scrollEventThrottle } = useEgNavBarScroll();
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
    return (
      <ScrollView
        style={styles.fill}
        contentInsetAdjustmentBehavior={topInset > 0 ? 'never' : 'automatic'}
        onScroll={onScroll}
        scrollEventThrottle={scrollEventThrottle}
        contentContainerStyle={[styles.scrollContent, topInset > 0 ? { paddingTop: topInset + (spacing['spacing-4'] ?? 16) } : null]}
      >
        {list}
      </ScrollView>
    );
  }
  return (
    <View style={[styles.page, { paddingTop: topInset }]}>
      <Pressable accessibilityRole="button" onPress={onBack} style={styles.backHit}>
        <Text style={[styles.back, { color: colors.brand as string }]}>{backLabel}</Text>
      </Pressable>
      <Text style={[styles.largeTitle, { color: primary }]}>{title}</Text>
      {list}
    </View>
  );
}

const spacing = mobileTheme.spacing as Record<string, number>;

const styles = StyleSheet.create({
  fill: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: spacing['spacing-5'] ?? 20,
    paddingTop: spacing['spacing-4'] ?? 16,
    paddingBottom: spacing['spacing-8'] ?? 32,
  },
  page: {
    flex: 1,
    paddingHorizontal: spacing['spacing-5'] ?? 20,
  },
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
