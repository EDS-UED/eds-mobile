import { StyleSheet, View, type StyleProp, type ViewProps, type ViewStyle } from 'react-native';

import { resolveThemeMode, type ThemeMode } from '../../../theme/index.js';
import { EgTabBarFlatBackground } from '../_shared/EgTabBarFlatBackground.js';
import { egTabBarStyles } from '../_shared/egTabBarStyles.js';
import type { EgTabBarGlassBgProps } from './EgTabBarGlassBg.types.js';

/** Figma Glass BG — 与 `glass-tabbar-bg` 渐变一致；RN 无 blur。 */
export function EgTabBarGlassBg(props: EgTabBarGlassBgProps & Pick<ViewProps, 'style'>) {
  const { testID, style, mode: modeProp } = props;
  const mode: ThemeMode = modeProp ?? resolveThemeMode(undefined);

  return (
    <View testID={testID ?? 'tab-bar-glass-bg'} style={mergeBarStyle(style)}>
      <EgTabBarFlatBackground mode={mode} style={styles.fill} />
    </View>
  );
}

function mergeBarStyle(style?: StyleProp<ViewStyle>): ViewStyle {
  return {
    ...egTabBarStyles.glass,
    ...styles.bar,
    ...(StyleSheet.flatten(style) ?? {}),
  };
}

const styles = StyleSheet.create({
  bar: {
    flex: 1,
  },
  fill: {
    flex: 1,
  },
});
