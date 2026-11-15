import { useCallback, useMemo, useState, type ReactNode } from 'react';
import { Platform, StyleSheet, View, type LayoutChangeEvent, type StyleProp, type ViewStyle } from 'react-native';

import { EgDivider } from '../divider/divider/EgDivider.js';
import { getThemeColors, mobileTheme, type ThemeMode } from '../../theme/index.js';
import { useGlassBlurTargetRef } from './GlassBlurScope.js';
import { rnColorFromHex } from './glassBoxColorUtils.js';
import { getNativeBlurView, resolveAndroidBlurMethod } from './nativeBlur.js';
import { getNativeLinearGradient } from './nativeLinearGradient.js';
import { getMaskedView } from './nativeMaskedView.js';

/**
 * iOS 26 `ScrollEdgeEffectStyle` 同名四档：
 * - `soft`：轻模糊 + 色调自边缘向内淡出至透明，无分割线
 * - `hard`：轻模糊 + 色调整体更不透明、边界更清晰，带分割线
 * - `automatic`：按宿主解析（页面 → soft · Sheet → hard）
 * - `hidden`：不绘制
 */
export type EgScrollEdgeEffectStyle = 'automatic' | 'soft' | 'hard' | 'hidden';

/** 效果所在滚动边缘 — `top` 贴导航栏 · `bottom` 贴底部工具栏 / Tab。 */
export type EgScrollEdgeEffectEdge = 'top' | 'bottom';

/** `automatic` 的解析宿主 — 同 iOS 26：普通页面 soft，Sheet 内 hard。 */
export type EgScrollEdgeEffectContainer = 'page' | 'sheet';

export type EgScrollEdgeEffectProps = {
  effect?: EgScrollEdgeEffectStyle;
  edge?: EgScrollEdgeEffectEdge;
  container?: EgScrollEdgeEffectContainer;
  mode?: ThemeMode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function resolveEgScrollEdgeEffect(
  effect: EgScrollEdgeEffectStyle,
  container: EgScrollEdgeEffectContainer = 'page',
): 'soft' | 'hard' | 'hidden' {
  if (effect === 'automatic') return container === 'sheet' ? 'hard' : 'soft';
  return effect;
}

/** Scroll edge 扩散试听 — 暂硬编码；定稿后换回 `blur-sm` → `nativeBlurIntensity`。 */
const SCROLL_EDGE_BLUR_INTENSITY = 8;

/** soft · `spacing-10` · hard · `spacing-3` — 朝内容一侧虚化带高度（px，非 padding）。 */
function scrollEdgeContentInset(variant: 'soft' | 'hard'): number {
  const key = variant === 'soft' ? 'spacing-10' : 'spacing-3';
  const value = mobileTheme.spacing[key];
  return typeof value === 'number' ? value : variant === 'soft' ? 40 : 12;
}

/** 内容侧虚化带起点（归一化 0–1）— 顶栏为自底向上 inset；底栏为自顶向下 inset。 */
function scrollEdgeContentFadeBoundary(
  layoutHeight: number,
  inset: number,
  edge: EgScrollEdgeEffectEdge,
): number {
  if (layoutHeight <= 0 || inset <= 0) {
    return edge === 'top' ? 1 : 0;
  }
  const band = Math.min(inset, layoutHeight);
  return edge === 'top' ? (layoutHeight - band) / layoutHeight : band / layoutHeight;
}

/** 叠色 — Deep → Shallow，内容侧 `inset` 段 Subtle；停点随栏高与 inset 联动。 */
function resolveScrollEdgeOverlayGradient(
  mode: ThemeMode,
  edge: EgScrollEdgeEffectEdge,
  layoutHeight: number,
  inset: number,
): { colors: [string, string, string]; locations: [number, number, number] } {
  const colors = getThemeColors(mode);
  const deep = rnColorFromHex(colors['effect-overlay-deep'] as string);
  const shallow = rnColorFromHex(colors['effect-overlay-shallow'] as string);
  const subtle = rnColorFromHex(colors['effect-overlay-subtle'] as string);
  const boundary = scrollEdgeContentFadeBoundary(layoutHeight, inset, edge);

  if (edge === 'top') {
    return { colors: [deep, shallow, subtle], locations: [0, boundary, 1] };
  }
  return { colors: [subtle, shallow, deep], locations: [0, boundary, 1] };
}

/** soft — 模糊在内容侧 `inset` 带内渐隐（与叠色同一 boundary）。 */
function resolveSoftBlurMask(
  edge: EgScrollEdgeEffectEdge,
  layoutHeight: number,
  inset: number,
): { colors: [string, string, string]; locations: [number, number, number] } {
  const boundary = scrollEdgeContentFadeBoundary(layoutHeight, inset, edge);
  if (edge === 'top') {
    return { colors: ['black', 'black', 'transparent'], locations: [0, boundary, 1] };
  }
  return { colors: ['transparent', 'black', 'black'], locations: [0, boundary, 1] };
}

function EdgeMaterial({
  edge,
  mode,
  variant,
  layoutHeight,
  contentInset,
}: {
  edge: EgScrollEdgeEffectEdge;
  mode: ThemeMode;
  variant: 'soft' | 'hard';
  layoutHeight: number;
  contentInset: number;
}) {
  const BlurView = getNativeBlurView();
  const LinearGradient = getNativeLinearGradient();
  const blurTargetRef = useGlassBlurTargetRef();

  const tint = useMemo(
    () => resolveScrollEdgeOverlayGradient(mode, edge, layoutHeight, contentInset),
    [contentInset, edge, layoutHeight, mode],
  );
  const MaskedView = variant === 'soft' ? getMaskedView() : null;
  const softMask = useMemo(
    () => (variant === 'soft' ? resolveSoftBlurMask(edge, layoutHeight, contentInset) : null),
    [contentInset, edge, layoutHeight, variant],
  );

  const blurLayer = BlurView ? (
    <BlurView
      key={Platform.OS === 'android' && blurTargetRef ? 'android-blur-target' : 'blur'}
      intensity={SCROLL_EDGE_BLUR_INTENSITY}
      tint={mode === 'dark' ? 'dark' : 'light'}
      blurTarget={Platform.OS === 'ios' ? undefined : (blurTargetRef ?? undefined)}
      blurMethod={
        Platform.OS === 'android' ? (blurTargetRef ? resolveAndroidBlurMethod() : 'none') : undefined
      }
      blurReductionFactor={Platform.OS === 'android' ? 2 : undefined}
      style={StyleSheet.absoluteFill}
    />
  ) : null;

  const tintLayer = LinearGradient ? (
    <LinearGradient
      pointerEvents="none"
      colors={tint.colors}
      locations={tint.locations}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={StyleSheet.absoluteFill}
    />
  ) : (
    <View style={[StyleSheet.absoluteFill, { backgroundColor: tint.colors[0] }]} />
  );

  if (MaskedView && LinearGradient && softMask) {
    const masked = (content: ReactNode) => (
      <MaskedView
        style={StyleSheet.absoluteFill}
        maskElement={
          <LinearGradient
            colors={softMask.colors}
            locations={softMask.locations}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        }
      >
        <View style={StyleSheet.absoluteFill}>{content}</View>
      </MaskedView>
    );

    /** Android dimezis BlurView 在 MaskedView 内不出图 — 模糊置于遮罩外、限在虚化带以外，叠色仍随遮罩渐隐。 */
    if (Platform.OS === 'android') {
      return (
        <View style={StyleSheet.absoluteFill}>
          {blurLayer ? (
            <View pointerEvents="none" style={androidSoftBlurFrame(edge, layoutHeight, contentInset)}>
              {blurLayer}
            </View>
          ) : null}
          {masked(tintLayer)}
        </View>
      );
    }

    return masked(
      <>
        {blurLayer}
        {tintLayer}
      </>,
    );
  }

  return (
    <View style={StyleSheet.absoluteFill}>
      {blurLayer}
      {tintLayer}
    </View>
  );
}

/** soft 遮罩全黑段（虚化带以外）— 顶栏 inset 0 时即整高。 */
function androidSoftBlurFrame(edge: EgScrollEdgeEffectEdge, layoutHeight: number, inset: number): ViewStyle {
  const band = layoutHeight > 0 ? Math.min(inset, layoutHeight) : 0;
  return edge === 'top'
    ? { position: 'absolute', left: 0, right: 0, top: 0, bottom: band }
    : { position: 'absolute', left: 0, right: 0, top: band, bottom: 0 };
}

/**
 * **遮罩浅（ScrollEdgeEffect）** — 对标 iOS 26 `scrollEdgeEffectStyle`，
 * 单层模糊 + Overlay Deep → Shallow 渐变；`edge="top"` 无朝内容侧虚化带（inset 0），底栏 soft `spacing-10` · hard `spacing-3`。
 * 宿主选档见 `GlassMaskBackdrop`（iOS 26+ 原生 · iOS 26 以下本组件 · Android 遮罩深）。
 * 显隐由宿主（如 `EgNavBar` `background="auto"`）驱动。
 */
export function EgScrollEdgeEffect({
  effect = 'automatic',
  edge = 'top',
  container = 'page',
  mode = 'light',
  style,
  testID,
}: EgScrollEdgeEffectProps) {
  const resolved = resolveEgScrollEdgeEffect(effect, container);
  const [layoutHeight, setLayoutHeight] = useState(0);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const height = Math.round(event.nativeEvent.layout.height);
    setLayoutHeight((prev) => (prev === height ? prev : height));
  }, []);

  if (resolved === 'hidden') return null;

  /** 顶栏（EgNavBar）— 保留 blur + 叠色，不画朝内容侧虚化淡出带；底栏仍用 soft/hard inset。 */
  const contentFadeInset = edge === 'top' ? 0 : scrollEdgeContentInset(resolved);

  const rootStyle = StyleSheet.flatten([
    styles.root,
    resolved === 'hard' ? styles.rootHard : undefined,
    style,
  ]);

  return (
    <View
      pointerEvents="none"
      style={rootStyle}
      onLayout={onLayout}
      testID={testID ?? `eg-scroll-edge-effect-${resolved}`}
    >
      <EdgeMaterial
        edge={edge}
        mode={mode}
        variant={resolved}
        layoutHeight={layoutHeight}
        contentInset={contentFadeInset}
      />
      {resolved === 'hard' ? (
        <View
          style={[styles.divider, edge === 'top' ? styles.dividerBottom : styles.dividerTop]}
          collapsable={false}
        >
          <EgDivider variant="module" mode={mode} orientation="horizontal" />
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFill,
    overflow: 'hidden',
  },
  /** hard 底边 module 线 — 避免 `overflow: hidden` 裁掉 hairline。 */
  rootHard: {
    overflow: 'visible',
  },
  divider: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 10,
    elevation: 10,
  },
  dividerBottom: {
    bottom: 0,
  },
  dividerTop: {
    top: 0,
  },
});