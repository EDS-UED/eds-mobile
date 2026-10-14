import { EgTabBar, GlassBlurScope } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { GlassBoxPreviewBackdropGradient } from '@/views/tokens/glassBoxPreviewBackdrop';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

/** 详情画布居中且 Inspect 包裹层按内容定宽 — 须显式给宽。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

type ShowcaseTabBarPreviewProps = {
  mode?: 'light' | 'dark';
  testID?: string;
  defaultSelectedIndex?: number | string;
  selectedIndex?: number;
  disabled?: boolean;
  flushShell?: boolean;
};

/**
 * EgTabBar 详情预览 — 仅 pill + glass（`edgeToEdge`），不铺 Figma 页级 BottomChrome /
 * 全高 minHeight，避免画布内出现居中色球、条被挤没。
 */
export function ShowcaseTabBarPreview({
  mode = 'light',
  testID,
  flushShell: _flushShell,
  defaultSelectedIndex,
  selectedIndex,
  disabled,
  ...rest
}: ShowcaseTabBarPreviewProps & Record<string, unknown>) {
  const colors = useShowcaseColors();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;

  const resolvedDefaultIndex =
    defaultSelectedIndex !== undefined && defaultSelectedIndex !== ''
      ? Number(defaultSelectedIndex)
      : undefined;

  const previewBackdrop = (
    <View pointerEvents="none" style={styles.previewBackdrop}>
      <GlassBoxPreviewBackdropGradient colors={colors} />
    </View>
  );

  return (
    <View style={[styles.stageWrap, { width: railWidth, alignSelf: 'stretch' }]} testID={testID}>
      <GlassBlurScope>
        <EgTabBar
          {...rest}
          mode={mode}
          testID={testID ?? 'tab-bar-base'}
          defaultSelectedIndex={resolvedDefaultIndex}
          selectedIndex={selectedIndex}
          disabled={disabled}
          edgeToEdge
          forceRnImplementation
          previewBackdrop={previewBackdrop}
        />
      </GlassBlurScope>
    </View>
  );
}

const styles = StyleSheet.create({
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
