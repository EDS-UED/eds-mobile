import { EgDivider } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import type { ThemeMode } from '@eds/mobile-components';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

/** 详情画布居中且 Inspect 包裹层按内容定宽 — 须按窗口算可用宽度。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

export function ShowcaseDividerPreview(props: Record<string, unknown>) {
  const { colorTheme } = useShowcaseThemeContext();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;
  const orientation = props.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const variant = props.variant === 'module' ? 'module' : 'page';
  const mode: ThemeMode =
    props.mode === 'dark' || props.mode === 'light' ? props.mode : colorTheme;
  const visible = props.visible !== false;

  const lineLength =
    orientation === 'horizontal'
      ? Math.max(0, railWidth - 2 * showcaseTheme.layout.cardPaddingHorizontal)
      : showcaseTheme.layout.cardPaddingVertical * 2 + 80;

  return (
    <View style={[styles.rail, { width: railWidth, alignSelf: 'stretch' }]}>
      <EgDivider
        variant={variant}
        orientation={orientation}
        visible={visible}
        mode={mode}
        length={lineLength}
        testID={typeof props.testID === 'string' ? props.testID : 'divider'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
  },
});