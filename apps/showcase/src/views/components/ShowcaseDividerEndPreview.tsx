import { EgDividerEnd } from '@eds/mobile-components';
import { catalogPreviewCanvasStyle } from '@eds/mobile-components/catalog';
import type { ThemeMode } from '@eds/mobile-components';
import { StyleSheet, View, useWindowDimensions } from 'react-native';

import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcaseTheme } from '@/views/shared/showcaseTheme';

const STAGE_HORIZONTAL_CHROME =
  2 * (showcaseTheme.layout.cardPaddingHorizontal + catalogPreviewCanvasStyle.padding);

export function ShowcaseDividerEndPreview(props: Record<string, unknown>) {
  const { colorTheme } = useShowcaseThemeContext();
  const { width: windowWidth } = useWindowDimensions();
  const railWidth = windowWidth - STAGE_HORIZONTAL_CHROME;
  const mode: ThemeMode =
    props.mode === 'dark' || props.mode === 'light' ? props.mode : colorTheme;

  return (
    <View style={[styles.rail, { width: railWidth, alignSelf: 'stretch' }]}>
      <EgDividerEnd
        mode={mode}
        testID={typeof props.testID === 'string' ? props.testID : 'divider-end'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  rail: {
    alignItems: 'stretch',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: showcaseTheme.layout.cardPaddingHorizontal,
    paddingVertical: showcaseTheme.layout.cardPaddingVertical,
  },
});