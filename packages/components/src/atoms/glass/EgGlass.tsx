import { useCallback, useMemo, useState, type ReactNode } from 'react';
import {
  LayoutChangeEvent,
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { EgDivider } from '../divider/divider/EgDivider.js';
import { GlassBoxEffectLayers } from './GlassBoxEffectLayers.js';
import { GlassBoxInsetHighlightOverlay } from './GlassBoxInsetHighlightOverlay.js';
import { rnGlassBoxOuterShadowHostStyle } from './glassBoxRnStyle.js';
import {
  capGlassBoxBorderRadius,
  glassBoxDefaultBorderWidth,
  glassBoxRadiusStyle,
} from './resolveGlassBoxGeometry.js';
import {
  resolveGlassBoxComposition,
  type GlassBoxClassName,
} from './resolveGlassBox.js';
import { getThemeColors, type ThemeMode } from '../../theme/index.js';
import { rnColorFromHex } from './glassBoxRnStyle.js';

export type EgGlassProps = {
  /** Effect 场景 class — 与 Figma Glass Box / `resolveGlassBoxComposition` 一致。 */
  box: GlassBoxClassName;
  mode?: ThemeMode;
  style?: StyleProp<ViewStyle>;
  /**
   * Showcase / 详情 preview：置于 blur 背后的色块（须 `absoluteFill`），
   * 保证 iOS `BlurView` 在同一 subtree 内采样到背衬（ sibling blur 在 RN 上常采不到）。
   */
  previewBackdrop?: ReactNode;
  children?: ReactNode;
  testID?: string;
};

/**
 * Effect Glass Box — expo-blur + token 填色 / overlay + `boxShadow`（与 dist/css/effect 同栈，双端一致）。
 * 系统 Liquid Glass（expo-glass-effect）走 GlassSurface / GlassControlShell，不与本组件叠两层材质。
 */
export function EgGlass({
  box,
  mode = 'light',
  style,
  previewBackdrop,
  children,
  testID,
}: EgGlassProps) {
  const composition = useMemo(() => resolveGlassBoxComposition(box, mode), [box, mode]);
  const colors = getThemeColors(mode);
  const [layout, setLayout] = useState({ width: 0, height: 0 });

  const maskBox = box === 'glass-mask-box';
  const radiusStyle = glassBoxRadiusStyle(box, composition.borderRadius);
  const borderWidth = maskBox
    ? 0
    : (composition.border?.width ?? glassBoxDefaultBorderWidth());
  const baseRadius =
    typeof radiusStyle.borderRadius === 'number' ? radiusStyle.borderRadius : 0;
  const borderRadius = capGlassBoxBorderRadius(baseRadius, layout.width, layout.height);

  const borderColor = rnColorFromHex(
    composition.border?.color ?? (colors['stroke-base-quaternary'] as string),
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    setLayout((prev) =>
      prev.width === width && prev.height === height ? prev : { width, height },
    );
  }, []);

  const outerShadows = maskBox ? [] : composition.shadows;

  const shadowHostStyle: ViewStyle = {
    ...radiusStyle,
    borderRadius,
    backgroundColor: 'transparent',
    overflow: 'visible',
    ...rnGlassBoxOuterShadowHostStyle(outerShadows),
  };

  const clipStyle: ViewStyle = {
    ...StyleSheet.absoluteFill,
    ...radiusStyle,
    borderRadius,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: borderWidth > 0 ? borderWidth : undefined,
    borderColor: borderWidth > 0 ? borderColor : undefined,
    overflow: 'hidden',
  };

  return (
    <View
      style={StyleSheet.flatten([styles.shadowHost, shadowHostStyle, style])}
      onLayout={onLayout}
      testID={testID}
    >
      <View style={clipStyle} pointerEvents="none">
        {previewBackdrop ? (
          <View pointerEvents="none" style={styles.previewBackdrop}>
            {previewBackdrop}
          </View>
        ) : null}
        <GlassBoxEffectLayers mode={mode} composition={composition} />
        <GlassBoxInsetHighlightOverlay
          shadows={outerShadows}
          borderRadius={borderRadius}
        />
      </View>
      {maskBox ? (
        <View style={styles.maskModuleDivider} pointerEvents="none">
          <EgDivider variant="module" mode={mode} orientation="horizontal" />
        </View>
      ) : null}
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  shadowHost: {
    position: 'relative',
  },
  previewBackdrop: {
    ...StyleSheet.absoluteFill,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 0,
  },
  maskModuleDivider: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    zIndex: 10,
    elevation: 10,
  },
});
