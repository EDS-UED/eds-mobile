import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, type ViewProps } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { resolveLayoutContentMotionTokens } from './layoutContentMotionTokens.js';
import { useMotionLayoutContentSwitch } from './useMotionLayoutContentSwitch.js';

export type EgEdsAnimaLayoutContentProps = Pick<ViewProps, 'style' | 'testID'> & {
  /** Tab / 内容导航 key 变化时播 layout-content 动效。 */
  contentKey: string;
  children: ReactNode;
  /** 切换开始或 swap 时调用（如 ScrollView scrollTo(0)）。 */
  onSwitchStart?: () => void;
  /** 覆盖 token swap 延迟（默认 120ms）。 */
  swapMs?: number;
  /** 系统减少动态效果 · 瞬时切换。 */
  reduceMotion?: boolean;
};

/** Reanimated `withTiming` 须用 reanimated 的 Easing（worklet）。 */
function reanimatedBezierFromCss(cubicBezier: string) {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier);
  if (!match) {
    return Easing.bezier(0.42, 0, 0.58, 1);
  }
  const parts = match[1].split(',').map((part) => Number.parseFloat(part.trim()));
  if (parts.length !== 4 || parts.some((value) => !Number.isFinite(value))) {
    return Easing.bezier(0.42, 0, 0.58, 1);
  }
  return Easing.bezier(parts[0], parts[1], parts[2], parts[3]);
}

/**
 * Semantic `.motion-layout-content` · EdsSemanticAnima('layout-content')。
 * 同壳正文 crossfade + 10px 下移 nudge · 120ms mid-swap。
 */
export function EgEdsAnimaLayoutContent({
  contentKey,
  children,
  onSwitchStart,
  swapMs,
  reduceMotion: reduceMotionProp,
  style,
  testID,
}: EgEdsAnimaLayoutContentProps) {
  const tokens = resolveLayoutContentMotionTokens();
  const opacityEasing = useMemo(
    () => reanimatedBezierFromCss(tokens.opacityEasing),
    [tokens.opacityEasing],
  );
  const transformEasing = useMemo(
    () => reanimatedBezierFromCss(tokens.transformEasing),
    [tokens.transformEasing],
  );
  const effectiveSwapMs = swapMs ?? tokens.swapMs;
  const { switchContent, isAnimating, reset } = useMotionLayoutContentSwitch(effectiveSwapMs);

  const [displayedChildren, setDisplayedChildren] = useState(children);
  const childrenRef = useRef(children);
  childrenRef.current = children;
  const displayedKeyRef = useRef(contentKey);
  const mountedRef = useRef(false);
  const [reduceMotionSystem, setReduceMotionSystem] = useState(false);

  const opacity = useSharedValue(tokens.opacityVisible);
  const translateY = useSharedValue(0);

  const reduceMotion = reduceMotionProp ?? reduceMotionSystem;

  useEffect(() => {
    let mounted = true;
    AccessibilityInfo.isReduceMotionEnabled()
      .then((enabled) => {
        if (mounted) {
          setReduceMotionSystem(enabled);
        }
      })
      .catch(() => undefined);
    const subscription = AccessibilityInfo.addEventListener?.('reduceMotionChanged', (enabled) => {
      setReduceMotionSystem(enabled);
    });
    return () => {
      mounted = false;
      subscription?.remove?.();
    };
  }, []);

  const animateToRest = () => {
    if (reduceMotion) {
      opacity.value = tokens.opacityVisible;
      translateY.value = 0;
      return;
    }
    opacity.value = withTiming(tokens.opacityVisible, {
      duration: tokens.opacityDurationMs,
      easing: opacityEasing,
    });
    translateY.value = withTiming(0, {
      duration: tokens.transformDurationMs,
      easing: transformEasing,
    });
  };

  const animateExit = () => {
    onSwitchStart?.();
    if (reduceMotion) {
      return;
    }
    opacity.value = withTiming(tokens.opacityHidden, {
      duration: tokens.opacityDurationMs,
      easing: opacityEasing,
    });
    translateY.value = withTiming(tokens.offsetY, {
      duration: tokens.transformDurationMs,
      easing: transformEasing,
    });
  };

  const snapEnterOffset = () => {
    cancelAnimation(opacity);
    cancelAnimation(translateY);
    opacity.value = tokens.opacityHidden;
    translateY.value = tokens.offsetY;
  };

  useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      displayedKeyRef.current = contentKey;
      setDisplayedChildren(children);
      return;
    }

    if (contentKey === displayedKeyRef.current) {
      if (!isAnimating) {
        setDisplayedChildren(children);
      }
      return;
    }

    reset();
    cancelAnimation(opacity);
    cancelAnimation(translateY);

    if (reduceMotion) {
      setDisplayedChildren(childrenRef.current);
      displayedKeyRef.current = contentKey;
      opacity.value = tokens.opacityVisible;
      translateY.value = 0;
      onSwitchStart?.();
      return;
    }

    opacity.value = tokens.opacityVisible;
    translateY.value = 0;
    animateExit();

    switchContent(() => {
      setDisplayedChildren(childrenRef.current);
      displayedKeyRef.current = contentKey;
      snapEnterOffset();
      requestAnimationFrame(() => {
        animateToRest();
      });
    });
  }, [contentKey, reduceMotion, reset, switchContent]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  return (
    <Animated.View
      testID={testID ?? 'motion-layout-content'}
      style={[style, animatedStyle]}
      accessibilityElementsHidden={false}
    >
      {displayedChildren}
    </Animated.View>
  );
}
