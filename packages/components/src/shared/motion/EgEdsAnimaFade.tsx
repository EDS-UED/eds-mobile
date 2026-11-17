import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AccessibilityInfo, type ViewProps } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { resolveFadeMotionTokens } from './fadeMotionTokens.js';
import { useMotionLayoutContentSwitch } from './useMotionLayoutContentSwitch.js';

export type EgEdsAnimaFadeProps = Pick<ViewProps, 'style' | 'testID'> & {
  /** 内容 key 变化时播 fade 动效。 */
  contentKey: string;
  children: ReactNode;
  /** 切换开始或 swap 时调用（如 ScrollView scrollTo(0)）。 */
  onSwitchStart?: () => void;
  /** 覆盖 token swap 延迟（默认 `motion-delay-fade-swap`）。 */
  swapMs?: number;
  /** 系统减少动态效果 · 瞬时切换。 */
  reduceMotion?: boolean;
};

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
 * Semantic `.motion-fade` · EdsSemanticAnima('fade')。
 * 同壳纯 opacity crossfade · mid-swap token（motion-1）。
 */
export function EgEdsAnimaFade({
  contentKey,
  children,
  onSwitchStart,
  swapMs,
  reduceMotion: reduceMotionProp,
  style,
  testID,
}: EgEdsAnimaFadeProps) {
  const tokens = resolveFadeMotionTokens();
  const opacityEasing = useMemo(
    () => reanimatedBezierFromCss(tokens.opacityEasing),
    [tokens.opacityEasing],
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

  const animateToVisible = () => {
    if (reduceMotion) {
      opacity.value = tokens.opacityVisible;
      return;
    }
    opacity.value = withTiming(tokens.opacityVisible, {
      duration: tokens.opacityDurationMs,
      easing: opacityEasing,
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
  };

  const snapHidden = () => {
    cancelAnimation(opacity);
    opacity.value = tokens.opacityHidden;
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

    if (reduceMotion) {
      setDisplayedChildren(childrenRef.current);
      displayedKeyRef.current = contentKey;
      opacity.value = tokens.opacityVisible;
      onSwitchStart?.();
      return;
    }

    opacity.value = tokens.opacityVisible;
    animateExit();

    switchContent(() => {
      setDisplayedChildren(childrenRef.current);
      displayedKeyRef.current = contentKey;
      snapHidden();
      requestAnimationFrame(() => {
        animateToVisible();
      });
    });
  }, [contentKey, reduceMotion, reset, switchContent]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View testID={testID ?? 'motion-fade'} style={[style, animatedStyle]}>
      {displayedChildren}
    </Animated.View>
  );
}