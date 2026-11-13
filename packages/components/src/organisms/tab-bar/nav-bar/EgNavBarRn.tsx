import { useEffect, useState, type ReactNode } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { egButtonGlassIconMinSize } from '../../../molecules/button/button-glass/_shared/resolveEgButtonGlassShellStyle.js';
import { EgNavBarActionView } from './EgNavBarActionView.js';
import { egNavBarSlotMotion } from './egNavBarSlotMotion.js';
import { presetBodyMediumStrong, presetTitle } from '../../../shared/typographyStyles.js';
import { getThemeColors, mobileTheme } from '../../../theme/index.js';
import {
  EG_NAV_BAR_FADE_DURATION,
  EG_NAV_BAR_PADDING_BOTTOM,
  EG_NAV_BAR_PADDING_HORIZONTAL,
  EG_NAV_BAR_PADDING_TOP,
  EG_NAV_BAR_SCROLL_EDGE_DISTANCE,
  EG_NAV_BAR_TITLE_GAP,
} from './egNavBarMetrics.js';
import type { EgNavBarAction, EgNavBarProps } from './EgNavBar.types.js';

const DEFAULT_LEFT: EgNavBarAction = {
  kind: 'icon',
  icon: 'eds-arrow-left-ios',
  accessibilityLabel: '返回',
};

function useFade(visible: boolean) {
  const opacity = useSharedValue(visible ? 1 : 0);
  useEffect(() => {
    opacity.value = withTiming(visible ? 1 : 0, { duration: EG_NAV_BAR_FADE_DURATION });
  }, [opacity, visible]);
  return useAnimatedStyle(() => ({ opacity: opacity.value }));
}

type SlotProps = {
  visible: boolean;
  minWidth: number;
  align: 'flex-start' | 'flex-end';
  onContentWidth: (width: number) => void;
  shiftStyle?: ReturnType<typeof useAnimatedStyle>;
  children: ReactNode;
};

function EgNavBarSlot({ visible, minWidth, align, onContentWidth, shiftStyle, children }: SlotProps) {
  const fadeStyle = useFade(visible);
  return (
    <Animated.View
      style={[styles.slot, { minWidth, alignItems: align }, fadeStyle, shiftStyle]}
      pointerEvents={visible ? 'box-none' : 'none'}
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
    >
      <View onLayout={(event: LayoutChangeEvent) => onContentWidth(event.nativeEvent.layout.width)}>
        {children}
      </View>
    </Animated.View>
  );
}

const LAYOUT_SLOT_ANCHOR_WIDTH = 320;

function actionKey(action: EgNavBarAction | undefined): string {
  if (!action) return 'none';
  return [action.kind ?? 'icon', action.icon, action.iconAlt, action.iconCount, action.label, action.size]
    .map((part) => part ?? '')
    .join('|');
}

type LayoutSlotProps = {
  visible: boolean;
  contentKey: string;
  align: 'flex-start' | 'flex-end';
  onContentWidth: (width: number) => void;
  shiftStyle?: ReturnType<typeof useAnimatedStyle>;
  /** 槽位当前占位宽度（0 = 收起），供靠左标题等联动。 */
  width: SharedValue<number>;
  children: ReactNode;
};

/**
 * `slotTransition="layout"` 槽位：锚定层贴外侧边，宽度动画让出 / 收回空间；
 * 操作以 key 切换 → 新旧 crossfade + 缩放，离场副本停在原位不随宽度漂移。
 */
function EgNavBarLayoutSlot({
  visible,
  contentKey,
  align,
  onContentWidth,
  shiftStyle,
  width,
  children,
}: LayoutSlotProps) {
  const motion = egNavBarSlotMotion();
  /** 挂载即可见的槽位首帧直接到位；之后的显隐 / 换内容一律动画。 */
  const snapNextLayout = useSharedValue(visible);

  useEffect(() => {
    if (!visible) {
      width.value = withTiming(0, motion.timing);
    }
  }, [visible, width]);

  const sizeStyle = useAnimatedStyle(() => ({ width: width.value }), [width]);

  return (
    <Animated.View
      style={[styles.layoutSlot, sizeStyle, shiftStyle]}
      pointerEvents="box-none"
      accessibilityElementsHidden={!visible}
      importantForAccessibility={visible ? 'auto' : 'no-hide-descendants'}
    >
      <View
        style={[
          styles.layoutSlotAnchor,
          align === 'flex-end'
            ? { right: 0, justifyContent: 'flex-end' }
            : { left: 0, justifyContent: 'flex-start' },
        ]}
        pointerEvents="box-none"
      >
        {visible ? (
          <Animated.View
            key={contentKey}
            entering={motion.entering}
            exiting={motion.exiting}
            onLayout={(event: LayoutChangeEvent) => {
              const next = event.nativeEvent.layout.width;
              onContentWidth(next);
              if (snapNextLayout.value) {
                snapNextLayout.value = false;
                width.value = next;
                return;
              }
              width.value = withTiming(next, motion.timing);
            }}
          >
            {children}
          </Animated.View>
        ) : null}
      </View>
    </Animated.View>
  );
}

/** RN 顶栏 · 背景 `glass-mask-box`（Android / iOS ≤25 · 以及 iOS 26+ overlay 如 EgSheets）。 */
export function EgNavBarRn(props: EgNavBarProps) {
  const {
    title,
    left = DEFAULT_LEFT,
    right,
    showLeft = true,
    showTitle = true,
    titleAlign = 'center',
    leadingTitleInset,
    leadingTitleGap,
    contentPaddingHorizontal,
    contentPaddingTop,
    contentPaddingBottom,
    showRight = true,
    background = 'auto',
    scrollOffset,
    edgeShift,
    contentUnder = false,
    topInset,
    manageStatusBar = true,
    mode = 'light',
    testID,
    style,
    slotTransition = 'fade',
  } = props;
  const layoutTransition = slotTransition === 'layout';

  const insets = useSafeAreaInsets();
  const statusZone = topInset ?? insets.top;
  const colors = getThemeColors(mode);

  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);
  const leftVisible = showLeft;
  const rightVisible = showRight && right != null;
  const leading = titleAlign === 'leading';
  const rowPaddingHorizontal = contentPaddingHorizontal ?? EG_NAV_BAR_PADDING_HORIZONTAL;
  const rowPaddingTop = contentPaddingTop ?? EG_NAV_BAR_PADDING_TOP;
  const rowPaddingBottom = contentPaddingBottom ?? EG_NAV_BAR_PADDING_BOTTOM;
  const titleLeadingInset = leadingTitleInset ?? (mobileTheme.spacing['spacing-2'] as number);
  const titleLeadingGap = leadingTitleGap ?? (mobileTheme.spacing['spacing-1'] as number);
  const sideWidth = leading ? 0 : Math.max(leftVisible ? leftWidth : 0, rightVisible ? rightWidth : 0);

  const scrollDriven = background === 'auto' && scrollOffset != null;
  const manualTarget = background === 'visible' ? 1 : background === 'hidden' ? 0 : contentUnder ? 1 : 0;
  const manualFade = useSharedValue(manualTarget);
  useEffect(() => {
    manualFade.value = withTiming(manualTarget, { duration: EG_NAV_BAR_FADE_DURATION });
  }, [manualFade, manualTarget]);

  const backgroundStyle = useAnimatedStyle(() => {
    if (scrollDriven && scrollOffset) {
      const progress = scrollOffset.value / EG_NAV_BAR_SCROLL_EDGE_DISTANCE;
      return { opacity: progress < 0 ? 0 : progress > 1 ? 1 : progress };
    }
    return { opacity: manualFade.value };
  }, [scrollDriven, scrollOffset]);

  const titleFadeStyle = useFade(showTitle && Boolean(title));
  const leadingShiftStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: edgeShift ? -edgeShift.value : 0 }] }),
    [edgeShift],
  );
  const trailingShiftStyle = useAnimatedStyle(
    () => ({ transform: [{ translateX: edgeShift ? edgeShift.value : 0 }] }),
    [edgeShift],
  );

  const leftSlotWidth = useSharedValue(0);
  const rightSlotWidth = useSharedValue(0);
  const titleMarginTarget = leftVisible ? titleLeadingGap : titleLeadingInset;
  const titleMargin = useSharedValue(titleMarginTarget);
  useEffect(() => {
    titleMargin.value = layoutTransition
      ? withTiming(titleMarginTarget, egNavBarSlotMotion().timing)
      : titleMarginTarget;
  }, [layoutTransition, titleMargin, titleMarginTarget]);
  const titleMarginStyle = useAnimatedStyle(() => ({ marginLeft: titleMargin.value }), [titleMargin]);

  const leftAction = (
    <EgNavBarActionView action={left} mode={mode} testID="nav-bar-left" />
  );
  const rightAction = right ? (
    <EgNavBarActionView action={right} mode={mode} testID="nav-bar-right" />
  ) : null;

  return (
    <View
      testID={testID ?? 'tab-bar-nav-bar'}
      style={[styles.root, { paddingTop: statusZone }, style as ViewStyle | undefined]}
      pointerEvents="box-none"
    >
      {manageStatusBar ? (
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle={mode === 'dark' ? 'light-content' : 'dark-content'}
          animated
        />
      ) : null}

      <Animated.View pointerEvents="none" style={[StyleSheet.absoluteFill, backgroundStyle]}>
        <EgGlass box="glass-mask-box" mode={mode} style={styles.backgroundFill} />
      </Animated.View>

      <View
        style={[
          styles.row,
          {
            paddingHorizontal: rowPaddingHorizontal,
            paddingTop: rowPaddingTop,
            paddingBottom: rowPaddingBottom,
          },
        ]}
        pointerEvents="box-none"
      >
        {layoutTransition ? (
          <EgNavBarLayoutSlot
            visible={leftVisible}
            contentKey={actionKey(left)}
            align="flex-start"
            onContentWidth={setLeftWidth}
            shiftStyle={leadingShiftStyle}
            width={leftSlotWidth}
          >
            {leftAction}
          </EgNavBarLayoutSlot>
        ) : leading && !leftVisible ? null : (
          <EgNavBarSlot
            visible={leftVisible}
            minWidth={sideWidth}
            align="flex-start"
            onContentWidth={setLeftWidth}
            shiftStyle={leadingShiftStyle}
          >
            {leftAction}
          </EgNavBarSlot>
        )}

        <Animated.View
          style={[
            styles.titleWrap,
            leading
              ? [
                  styles.titleWrapLeading,
                  layoutTransition ? titleMarginStyle : { marginLeft: titleMarginTarget },
                ]
              : null,
            titleFadeStyle,
            leading ? leadingShiftStyle : null,
          ]}
          pointerEvents="none"
        >
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[
              leading ? styles.titleLeading : styles.title,
              { color: colors['text-base-primary'] as string },
            ]}
          >
            {title ?? ''}
          </Text>
        </Animated.View>

        {layoutTransition ? (
          <EgNavBarLayoutSlot
            visible={rightVisible}
            contentKey={actionKey(right)}
            align="flex-end"
            onContentWidth={setRightWidth}
            shiftStyle={trailingShiftStyle}
            width={rightSlotWidth}
          >
            {rightAction}
          </EgNavBarLayoutSlot>
        ) : (
          <EgNavBarSlot
            visible={rightVisible}
            minWidth={sideWidth}
            align="flex-end"
            onContentWidth={setRightWidth}
            shiftStyle={trailingShiftStyle}
          >
            {rightAction}
          </EgNavBarSlot>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
  },
  backgroundFill: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  slot: {
    flexDirection: 'row',
  },
  layoutSlot: {
    minHeight: egButtonGlassIconMinSize(),
    overflow: 'visible',
  },
  /** 定宽锚定层 — 宽于任何操作，离场副本相对它定位，槽位宽度变化时不漂移。 */
  layoutSlotAnchor: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: LAYOUT_SLOT_ANCHOR_WIDTH,
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: EG_NAV_BAR_TITLE_GAP,
  },
  titleWrapLeading: {
    alignItems: 'flex-start',
    paddingLeft: 0,
  },
  title: {
    ...presetBodyMediumStrong(),
    textAlign: 'center',
  },
  titleLeading: {
    ...presetTitle(),
    textAlign: 'left',
  },
});
