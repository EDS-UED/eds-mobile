import { EgNavBar, shouldUseEgNavBarNativeStack } from '@eds/mobile-components';
import type { EgNavBarAction, EgNavBarBackground, ThemeMode } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

type ShowcaseNavBarPreviewProps = Record<string, unknown> & {
  mode?: ThemeMode;
  title?: string;
  showLeft?: boolean;
  showTitle?: boolean;
  showRight?: boolean;
  rightIconCount?: 1 | 2 | string;
  background?: EgNavBarBackground;
  statusBarZone?: boolean;
  forceRnImplementation?: boolean;
};

/** 详情画布居中且 Inspect 包裹层按内容定宽 — 舞台按画布可用宽度显式给宽。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

/**
 * 组件详情 — 卡片内恒为 EgNavBar（RN）。
 * 不可嵌套 `ScreenStack`（会与 Expo Router Stack 冲突报错）；iOS 26+ 系统栏见「全屏演示」。
 */
export function ShowcaseNavBarPreview(props: ShowcaseNavBarPreviewProps) {
  const {
    mode = 'light',
    title = '标题',
    showLeft = true,
    showTitle = true,
    showRight = true,
    rightIconCount = 1,
    background = 'auto',
    statusBarZone = true,
    forceRnImplementation = false,
  } = props;

  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const { width: windowWidth } = useWindowDimensions();

  const stageWidth = windowWidth - STAGE_HORIZONTAL_CHROME;
  const resolvedRightCount: 1 | 2 = Number(rightIconCount) === 2 ? 2 : 1;
  const systemNavAvailable = shouldUseEgNavBarNativeStack();
  const right: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-list-lattice-mobile',
    iconCount: resolvedRightCount,
    iconAlt: 'eds-add',
    accessibilityLabel: '更多',
  };

  const openFullScreenDemo = () =>
    router.push({
      pathname: '/(components)/nav-bar-demo',
      params: {
        title,
        showLeft: showLeft ? '1' : '0',
        showTitle: showTitle ? '1' : '0',
        showRight: showRight ? '1' : '0',
        rightIconCount: String(resolvedRightCount),
        background,
        forceRn: forceRnImplementation ? '1' : '0',
      },
    });

  return (
    <View style={styles.host}>
      <View style={[styles.stage, { width: stageWidth, backgroundColor: colors.page as string }]}>
        <EgNavBar
          mode={mode}
          title={title}
          showLeft={showLeft}
          showTitle={showTitle}
          showRight={showRight}
          right={right}
          background={background}
          topInset={statusBarZone ? insets.top : 0}
          manageStatusBar={false}
          forceRnImplementation
          style={styles.inFlowBar}
        />
      </View>
      <ShowcaseCardRow
        title="全屏演示"
        hint={
          systemNavAvailable && !forceRnImplementation
            ? '真实状态栏 · 系统导航栏（Liquid Glass）'
            : systemNavAvailable
              ? '系统导航栏（定制已强制 RN）'
              : '真实状态栏 · EgNavBar（RN）'
        }
        onPress={openFullScreenDemo}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  host: {
    gap: showcaseTheme.layout.cardGap,
  },
  stage: {
    overflow: 'hidden',
    ...showcaseTheme.blockRadius,
  },
  inFlowBar: {
    position: 'relative',
  },
});
