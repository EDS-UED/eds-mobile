import type { ReactNode } from 'react';
import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import type { ThemeMode } from '../../../theme/index.js';
import { EgTabBarFlatBackground } from './EgTabBarFlatBackground.js';

type EgTabBarBottomChromeProps = {
  mode: ThemeMode;
  previewBackdrop?: ReactNode;
  testID?: string;
  style?: StyleProp<ViewStyle>;
};

/** Figma Glass BG — 贴屏幕下沿；RN 渐变 token（无 blur）。 */
export function EgTabBarBottomChrome({
  mode,
  previewBackdrop,
  testID,
  style,
}: EgTabBarBottomChromeProps) {
  return (
    <View
      pointerEvents="none"
      testID={testID ?? 'tab-bar-bottom-chrome'}
      style={StyleSheet.flatten([styles.backdrop, style])}
    >
      {previewBackdrop}
      <EgTabBarFlatBackground mode={mode} />
    </View>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFill,
    zIndex: 0,
  },
});
