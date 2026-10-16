import {
  CREGIS_TAB_BAR_ITEMS,
  GlassBlurScope,
  shouldUseEgTabBarNativeStack,
} from '@eds/mobile-components';
import { EgTabBarRn } from '@eds/mobile-components/preview/rn';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import { router } from 'expo-router';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { ShowcaseCardRow } from '@/views/shared/ShowcaseCardRow';
import { showcaseTheme } from '@/views/shared/showcaseTheme';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';

/** 详情画布居中且 Inspect 包裹层按内容定宽 — 须显式给宽。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

export type ShowcaseTabBarVariant = 'base' | 'cregis';

type ShowcaseTabBarPreviewProps = {
  mode?: 'light' | 'dark';
  testID?: string;
  defaultSelectedIndex?: number | string;
  selectedIndex?: number;
  disabled?: boolean;
  variant?: ShowcaseTabBarVariant;
};

/**
 * 组件详情 — 卡片内为 Figma 对照（RN · pill + glass）；真实平台栈见「全屏演示」（同 NavBar）。
 */
export function ShowcaseTabBarPreview({
  mode = 'light',
  testID,
  defaultSelectedIndex,
  selectedIndex,
  disabled,
  variant = 'base',
}: ShowcaseTabBarPreviewProps & Record<string, unknown>) {
  const colors = useShowcaseColors();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;

  const resolvedDefaultIndex =
    defaultSelectedIndex !== undefined && defaultSelectedIndex !== ''
      ? Number(defaultSelectedIndex)
      : 0;

  const previewBackdrop = (
    <View pointerEvents="none" style={styles.previewBackdrop}>
      <GlassBoxPreviewBackdropGradient colors={colors} />
    </View>
  );

  const barProps = {
    mode,
    defaultSelectedIndex: resolvedDefaultIndex,
    selectedIndex,
    disabled,
    edgeToEdge: true,
    previewBackdrop,
  };

  const openFullScreenDemo = () =>
    router.push({
      pathname: '/(components)/tab-bar-demo',
      params: {
        variant,
        defaultSelectedIndex: String(resolvedDefaultIndex),
        disabled: disabled ? '1' : '0',
      },
    });

  return (
    <View style={[styles.host, { width: railWidth, alignSelf: 'stretch' }]}>
      <View style={styles.stageWrap} testID={testID}>
        <GlassBlurScope>
          {variant === 'cregis' ? (
            <EgTabBarRn
              {...barProps}
              items={CREGIS_TAB_BAR_ITEMS}
              selectionAccent="decor"
              testID={testID ?? 'tab-bar-cregis'}
            />
          ) : (
            <EgTabBarRn {...barProps} testID={testID ?? 'tab-bar-base'} />
          )}
        </GlassBlurScope>
      </View>
      <ShowcaseCardRow
        title="全屏演示"
        hint={
          shouldUseEgTabBarNativeStack()
            ? 'egNavBarNativeStackOptions + EgTabBarNativeView（EgNavBar / EgTabBar 原生栈）'
            : `EgNavBar + ${variant === 'cregis' ? 'EgCregisTabBar' : 'EgTabBar'}（RN）`
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
  stageWrap: {
    alignItems: 'stretch',
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    overflow: 'visible',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
