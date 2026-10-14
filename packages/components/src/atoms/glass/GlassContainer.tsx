import { mobileTheme } from '../../theme/index.js';
import { StyleSheet, View } from 'react-native';
import { getNativeGlassContainer } from './nativeLiquidGlass.js';
import type { GlassContainerProps } from './types.js';

export function GlassContainer({ morph = true, style, testID, children }: GlassContainerProps) {
  const spacing = Number.parseFloat(String(mobileTheme.glass.surface.container.containerSpacing ?? 8));
  const layoutStyle = [styles.root, { gap: spacing }, style];
  const NativeGlassContainer = morph ? getNativeGlassContainer() : null;

  if (NativeGlassContainer) {
    return (
      <NativeGlassContainer testID={testID} spacing={spacing} style={layoutStyle}>
        {children}
      </NativeGlassContainer>
    );
  }

  return (
    <View testID={testID} style={layoutStyle}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
