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
  glassBoxCornerStyle,
  glassBoxRadiusStyle,
} from './resolveGlassBoxGeometry.js';
import {
  resolveGlassBoxComposition,
  type GlassBoxClassName,
} from './resolveGlassBox.js';
import { getThemeColors, type ThemeMode } from '../../theme/index.js';
import {
  isAndroidSmoothCornerAvailable,
  SmoothCornerView,
} from '../../shared/smoothCorner/SmoothCornerView.js';
import { rnColorFromHex } from './glassBoxRnStyle.js';
import { useGlassMaskNativeEdge } from './GlassMaskScrollEdge.js';

/** Sheets 卡片 · Effect `glass-sheets-box`（`radius-2xl` · `box-flotation` · shallow 阴影）。 */
export const EG_GLASS_SHEETS_BOX = 'glass-sheets-box' as const satisfies GlassBoxClassName;

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
 * Effect Glass Box 毛玻璃兜底 — expo-blur + token 填色 / overlay + `boxShadow`（与 dist/css/effect 同栈，双端一致）。
 * 仅供 Android · iOS ≤25 的 RN 实现；iOS 26+ 由各 Eg* 整体切系统原生，不经本组件。
 * `glass-mask-box` 在 iOS 26+ `GlassMaskScrollEdgeScope` 内不绘 RN 层 — 背景为系统 scroll edge effect。
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
  const nativeMaskEdge = useGlassMaskNativeEdge();
  const radiusStyle = glassBoxRadiusStyle(box, composition.borderRadius);
  const borderWidth = maskBox ? 0 : (composition.border?.width ?? 0);
  const baseRadius =
    typeof radiusStyle.borderRadius === 'number' ? radiusStyle.borderRadius : 0;
  const borderRadius = capGlassBoxBorderRadius(baseRadius, layout.width, layout.height);
  const cornerStyle = glassBoxCornerStyle(borderRadius, layout.width, layout.height);

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
    ...cornerStyle,
    backgroundColor: 'transparent',
    overflow: 'visible',
    ...rnGlassBoxOuterShadowHostStyle(outerShadows),
  };

  if (maskBox && nativeMaskEdge) {
    return (
      <View style={StyleSheet.flatten([styles.shadowHost, style])} testID={testID}>
        {children}
      </View>
    );
  }

  const nativeSmoothCorner = isAndroidSmoothCornerAvailable();
  const rnBorder = borderWidth > 0 && !nativeSmoothCorner;
  const clipStyle: ViewStyle = {
    ...StyleSheet.absoluteFill,
    ...cornerStyle,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderWidth: rnBorder ? borderWidth : undefined,
    borderColor: rnBorder ? borderColor : undefined,
    overflow: 'hidden',
  };

  return (
    <View
      style={StyleSheet.flatten([styles.shadowHost, shadowHostStyle, style])}
      onLayout={onLayout}
      testID={testID}
    >
      <SmoothCornerView
        style={clipStyle}
        pointerEvents="none"
        radius={borderRadius}
        strokeWidth={nativeSmoothCorner ? borderWidth : undefined}
        strokeColor={nativeSmoothCorner && borderWidth > 0 ? borderColor : undefined}
      >
        {previewBackdrop ? (
          <View pointerEvents="none" style={styles.previewBackdrop}>
            {previewBackdrop}
          </View>
        ) : null}
        <GlassBoxEffectLayers mode={mode} composition={composition} />
        <GlassBoxInsetHighlightOverlay shadows={outerShadows} cornerStyle={cornerStyle} />
      </SmoothCornerView>
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
