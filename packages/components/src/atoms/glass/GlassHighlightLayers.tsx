import { StyleSheet, View, type ViewStyle } from 'react-native';
import {
  mixGlassBorderColor,
  mixGlassSurfaceColor,
  resolveGlassHighlightColor,
} from './resolveGlassSurfacePresets.js';
import type { ResolvedGlassVariant } from './types.js';
import type { ThemeMode } from '../../theme/index.js';

type GlassHighlightLayersProps = {
  mode: ThemeMode;
  variant: ResolvedGlassVariant;
  borderRadius: number | '50%';
};

export function GlassHighlightLayers({ mode, variant, borderRadius }: GlassHighlightLayersProps) {
  const highlightFace = resolveGlassHighlightColor(mode);
  const outerTop = mixGlassSurfaceColor(highlightFace, variant.highlightOpacity);
  const innerLine = mixGlassBorderColor(highlightFace, variant.innerHighlightOpacity);
  const radiusStyle: ViewStyle =
    borderRadius === '50%' ? { borderRadius: 9999 } : { borderRadius };

  return (
    <>
      <View
        pointerEvents="none"
        style={[
          styles.outerHighlight,
          radiusStyle,
          {
            backgroundColor: outerTop,
          },
        ]}
      />
      <View
        pointerEvents="none"
        style={[
          styles.innerHighlight,
          radiusStyle,
          {
            borderTopColor: innerLine,
          },
        ]}
      />
    </>
  );
}

const styles = StyleSheet.create({
  outerHighlight: {
    ...StyleSheet.absoluteFill,
    opacity: 1,
    zIndex: 1,
  },
  innerHighlight: {
    position: 'absolute',
    top: 1,
    left: 1,
    right: 1,
    bottom: 1,
    borderTopWidth: 1,
    zIndex: 1,
  },
});
