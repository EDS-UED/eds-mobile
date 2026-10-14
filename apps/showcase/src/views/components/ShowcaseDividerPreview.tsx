import { EgDivider } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import type { ThemeMode } from '@eds/mobile-components';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

/** 详情画布居中且 Inspect 包裹层按内容定宽 — 须按窗口算可用宽度。 */
const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

export function ShowcaseDividerPreview(props: Record<string, unknown>) {
  const colors = useShowcaseColors();
  const { colorTheme } = useShowcaseThemeContext();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;
  const orientation = props.orientation === 'vertical' ? 'vertical' : 'horizontal';
  const variant = props.variant === 'module' ? 'module' : 'page';
  const mode: ThemeMode =
    props.mode === 'dark' || props.mode === 'light' ? props.mode : colorTheme;
  const visible = props.visible !== false;

  const backdropInnerWidth = Math.max(
    0,
    railWidth - 2 * showcaseTheme.layout.cardPaddingHorizontal,
  );
  const lineLength =
    orientation === 'horizontal'
      ? backdropInnerWidth
      : (showcaseTheme.layout.cardPaddingVertical * 2 + 80);

  return (
    <View style={[styles.rail, { width: railWidth, alignSelf: 'stretch' }]}>
      <View
        style={[
          styles.backdrop,
          orientation === 'vertical' ? styles.backdropVertical : styles.backdropHorizontal,
          showcaseTheme.blockRadius,
          { backgroundColor: colors.page as string },
        ]}
      >
        <EgDivider
          variant={variant}
          orientation={orientation}
          visible={visible}
          mode={mode}
          length={lineLength}
          testID={typeof props.testID === 'string' ? props.testID : 'divider'}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    alignItems: 'stretch',
    minHeight: 48,
    justifyContent: 'center',
  },
  backdrop: {
    alignSelf: 'stretch',
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
    justifyContent: 'center',
  },
  backdropHorizontal: {
    alignItems: 'stretch',
  },
  backdropVertical: {
    alignItems: 'center',
  },
});
