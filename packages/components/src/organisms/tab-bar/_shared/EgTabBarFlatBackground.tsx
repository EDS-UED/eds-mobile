import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';

import { rnColorFromHex } from '../../../atoms/glass/glassBoxColorUtils.js';
import { getNativeLinearGradient } from '../../../atoms/glass/nativeLinearGradient.js';
import { resolveGlassBoxComposition } from '../../../atoms/glass/resolveGlassBox.js';
import { resolveColor } from '../../../shared/resolveColor.js';
import { getThemeColors, type ThemeMode } from '../../../theme/index.js';

/** Figma / spec：0% 在上 · 100% 在下（`glass-tabbar-bg` 0deg）。 */
const GRADIENT_START = { x: 0.5, y: 0 } as const;
const GRADIENT_END = { x: 0.5, y: 1 } as const;

type EgTabBarFlatBackgroundProps = {
  mode: ThemeMode;
  style?: StyleProp<ViewStyle>;
};

/** RN 栈 — `glass-tabbar-bg` 渐变（无 blur）。 */
export function EgTabBarFlatBackground({ mode, style }: EgTabBarFlatBackgroundProps) {
  const composition = resolveGlassBoxComposition('glass-tabbar-bg', mode);
  const gradientLayer = composition.layers.find((layer) => layer.kind === 'overlayGradient');
  const LinearGradient = getNativeLinearGradient();
  const fillStyle = StyleSheet.flatten([StyleSheet.absoluteFill, style]);

  if (
    LinearGradient &&
    gradientLayer?.kind === 'overlayGradient' &&
    gradientLayer.stops.length >= 2
  ) {
    const stops = [...gradientLayer.stops].sort((a, b) => a.position - b.position);
    return (
      <LinearGradient
        pointerEvents="none"
        colors={stops.map((stop) => rnColorFromHex(stop.color))}
        locations={stops.map((stop) => stop.position)}
        start={GRADIENT_START}
        end={GRADIENT_END}
        style={fillStyle}
      />
    );
  }

  const colors = getThemeColors(mode);
  const bottom = rnColorFromHex(resolveColor(colors, 'effect-overlay-deep'));

  return <View style={[fillStyle, { backgroundColor: bottom }]} />;
}
