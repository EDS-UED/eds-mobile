import { useEffect, useState, type ReactNode } from 'react';
import {
  StatusBar,
  StyleSheet,
  Text,
  View,
  type LayoutChangeEvent,
  type ViewStyle,
} from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EgGlass } from '../../../atoms/glass/EgGlass.js';
import { EgNavBarActionView } from './EgNavBarActionView.js';
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
  } = props;

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
        {leading && !leftVisible ? null : (
          <EgNavBarSlot
            visible={leftVisible}
            minWidth={sideWidth}
            align="flex-start"
            onContentWidth={setLeftWidth}
            shiftStyle={leadingShiftStyle}
          >
            <EgNavBarActionView action={left} mode={mode} testID="nav-bar-left" />
          </EgNavBarSlot>
        )}

        <Animated.View
          style={[
            styles.titleWrap,
            leading
              ? [
                  styles.titleWrapLeading,
                  { marginLeft: leftVisible ? titleLeadingGap : titleLeadingInset },
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

        <EgNavBarSlot
          visible={rightVisible}
          minWidth={sideWidth}
          align="flex-end"
          onContentWidth={setRightWidth}
          shiftStyle={trailingShiftStyle}
        >
          {right ? (
            <EgNavBarActionView action={right} mode={mode} testID="nav-bar-right" />
          ) : null}
        </EgNavBarSlot>
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
