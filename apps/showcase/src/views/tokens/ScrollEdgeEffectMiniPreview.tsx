import {
  EgButtonGlass,
  EgItem,
  EgItemGroup,
  EgNavBar,
  EgScrollEdgeEffect,
  GlassBlurBackdrop,
  GlassBlurScope,
  egNavBarContentHeight,
  useEgNavBarScroll,
  type EgNavBarAction,
} from '@eds/mobile-components';
import { LinearGradient } from 'expo-linear-gradient';
import { useCallback, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue } from 'react-native-reanimated';

import { resolveScrollEdgeStyle } from '@/data/tokens/glassEffectCustomizeModel';
import type { ShowcaseColorMap } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { edsSpacing, edsTokenFont } from '@/views/shared/resolveEdsTheme';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

/** 模拟状态栏区高度 — 预览框内无真实 safe area。 */
const MOCK_STATUS_ZONE = edsSpacing('spacing-8');
/** 底部边缘显现距离 — 与顶栏 `EG_NAV_BAR_SCROLL_EDGE_DISTANCE` 同档。 */
const BOTTOM_EDGE_DISTANCE = edsSpacing('spacing-4');
const TILE_KEYS = [
  'material-brand',
  'material-decor',
  'material-match',
  'material-brand-weaken',
  'material-decor-weaken',
  'material-match-weaken',
] as const;
const LIST_ROWS = [
  { label: '照片', value: '1,284' },
  { label: '收藏', value: '96' },
  { label: '最近删除', value: '12' },
  { label: '共享相簿', value: '4' },
];

type ScrollEdgeEffectMiniPreviewProps = {
  state: Record<string, unknown>;
  colors: ShowcaseColorMap;
};

function TileGrid({ colors, offset }: { colors: ShowcaseColorMap; offset: number }) {
  return (
    <View style={styles.grid}>
      {TILE_KEYS.map((key, index) => (
        <View
          key={key}
          style={[
            styles.tile,
            { backgroundColor: colors[TILE_KEYS[(index + offset) % TILE_KEYS.length]!] as string },
          ]}
        />
      ))}
    </View>
  );
}

/** 真实页面模拟 — 状态栏 · RN 顶栏（顶部边缘）· 内容 · 玻璃工具栏（底部边缘）。 */
export function ScrollEdgeEffectMiniPreview({ state, colors }: ScrollEdgeEffectMiniPreviewProps) {
  const { colorTheme } = useShowcaseThemeContext();
  const mode = colorTheme === 'dark' ? 'dark' : 'light';
  const container = state.container === 'sheet' ? 'sheet' : 'page';
  const topScrollEdge = resolveScrollEdgeStyle(state, 'top');
  const bottomScrollEdge = resolveScrollEdgeStyle(state, 'bottom');
  const navScroll = useEgNavBarScroll({ nativeScrollEdge: false });
  const bottomDistance = useSharedValue(BOTTOM_EDGE_DISTANCE);
  const [toolbarHeight, setToolbarHeight] = useState(0);

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      navScroll.onScroll(event);
      const { contentOffset, contentSize, layoutMeasurement } = event.nativeEvent;
      bottomDistance.value = contentSize.height - layoutMeasurement.height - contentOffset.y;
    },
    [bottomDistance, navScroll],
  );

  const bottomEdgeStyle = useAnimatedStyle(() => {
    const progress = bottomDistance.value / BOTTOM_EDGE_DISTANCE;
    return { opacity: progress < 0 ? 0 : progress > 1 ? 1 : progress };
  });

  const showLeft = state.showLeft !== false;
  const showRight = state.showRight !== false;
  const left: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: () => undefined,
  };
  const right: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-list-lattice-mobile',
    iconCount: state.rightIconCount === '2' ? 2 : 1,
    iconAlt: 'eds-add',
    accessibilityLabel: '更多',
    onPress: () => undefined,
  };
  const textPrimary = colors['text-base-primary'] as string;
  const textSecondary = colors['text-base-secondary'] as string;

  return (
    <View style={styles.wrap}>
      <View style={[styles.frame, theme.blockRadius, { backgroundColor: colors.page as string }]}>
        <GlassBlurScope>
          <GlassBlurBackdrop style={StyleSheet.absoluteFill}>
            <ScrollView
              style={StyleSheet.absoluteFill}
              nestedScrollEnabled
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              onScroll={onScroll}
              scrollEventThrottle={navScroll.scrollEventThrottle}
              contentContainerStyle={[
                styles.content,
                {
                  paddingTop: MOCK_STATUS_ZONE + egNavBarContentHeight() + edsSpacing('spacing-2'),
                  paddingBottom: toolbarHeight + edsSpacing('spacing-4'),
                },
              ]}
            >
              <LinearGradient
                colors={[
                  colors['material-brand'] as string,
                  colors['material-decor'] as string,
                  colors['material-match'] as string,
                ]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={[styles.hero, theme.smoothRadius.xl]}
              />
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>最近项目</Text>
              <TileGrid colors={colors} offset={0} />
              <EgItemGroup mode={mode}>
                {LIST_ROWS.map((row, index) => (
                  <EgItem
                    key={row.label}
                    label={row.label}
                    value={row.value}
                    trailingDisplay="icon"
                    showDivider={index < LIST_ROWS.length - 1}
                    mode={mode}
                  />
                ))}
              </EgItemGroup>
              <Text style={[styles.sectionTitle, { color: textPrimary }]}>为你推荐</Text>
              <TileGrid colors={colors} offset={3} />
              <Text style={[styles.footnote, { color: textSecondary }]}>已显示全部内容</Text>
            </ScrollView>
          </GlassBlurBackdrop>

          <EgNavBar
            chromeContext="overlay"
            mode={mode}
            title={String(state.title ?? '标题')}
            left={left}
            right={right}
            showLeft={showLeft}
            showTitle={state.showTitle !== false}
            showRight={showRight}
            background="auto"
            scrollEdgeEffect={topScrollEdge}
            scrollOffset={navScroll.scrollOffset}
            topInset={MOCK_STATUS_ZONE}
            manageStatusBar={false}
          />

          <View
            style={styles.toolbar}
            pointerEvents="box-none"
            onLayout={(event: LayoutChangeEvent) => setToolbarHeight(Math.round(event.nativeEvent.layout.height))}
          >
            <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, bottomEdgeStyle]}>
              <EgScrollEdgeEffect
                effect={bottomScrollEdge}
                edge="bottom"
                container={container}
                mode={mode}
              />
            </Animated.View>
            <View style={styles.toolbarRow} pointerEvents="box-none">
              <EgButtonGlass kind="icon" icon="eds-add" mode={mode} accessibilityLabel="添加" />
              <EgButtonGlass kind="text" label="选择" size="md" mode={mode} />
            </View>
            <View style={[styles.homeIndicator, { backgroundColor: textPrimary }]} />
          </View>

          <View style={styles.statusBar} pointerEvents="none">
            <Text style={[styles.statusTime, { color: textPrimary }]}>9:41</Text>
            <View style={[styles.statusBattery, { borderColor: textPrimary }]}>
              <View style={[styles.statusBatteryLevel, { backgroundColor: textPrimary }]} />
            </View>
          </View>
        </GlassBlurScope>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    alignItems: 'center',
  },
  frame: {
    position: 'relative',
    width: '100%',
    maxWidth: 360,
    height: 520,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: edsSpacing('spacing-4'),
    gap: edsSpacing('spacing-4'),
  },
  hero: {
    height: 168,
  },
  sectionTitle: {
    ...edsTokenFont('body-large-heavy', '700'),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: edsSpacing('spacing-2'),
  },
  tile: {
    width: '31.5%',
    aspectRatio: 1,
    ...theme.smoothRadius.lg,
  },
  footnote: {
    ...edsTokenFont('body-small', '400'),
    textAlign: 'center',
  },
  toolbar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 10,
    paddingTop: edsSpacing('spacing-3'),
    paddingBottom: edsSpacing('spacing-2'),
  },
  toolbarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: edsSpacing('spacing-4'),
  },
  homeIndicator: {
    alignSelf: 'center',
    width: 120,
    height: 4,
    marginTop: edsSpacing('spacing-3'),
    borderRadius: theme.radius.full,
    opacity: 0.85,
  },
  statusBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: MOCK_STATUS_ZONE,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: edsSpacing('spacing-6'),
  },
  statusTime: {
    ...edsTokenFont('body-small-strong', '600'),
  },
  statusBattery: {
    width: 24,
    height: 11,
    borderWidth: 1,
    ...theme.smoothRadius.sm,
    padding: 1,
    opacity: 0.85,
  },
  statusBatteryLevel: {
    flex: 1,
    width: '80%',
  },
});
