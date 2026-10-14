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
import { EgButtonGlass } from '../../../molecules/button/button-glass/EgButtonGlass.js';
import { presetBodyMediumStrong } from '../../../shared/typographyStyles.js';
import { getThemeColors } from '../../../theme/index.js';
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
  children: ReactNode;
};

function EgNavBarSlot({ visible, minWidth, align, onContentWidth, children }: SlotProps) {
  const fadeStyle = useFade(visible);
  return (
    <Animated.View
      style={[styles.slot, { minWidth, alignItems: align }, fadeStyle]}
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

function EgNavBarActionButton({
  action,
  mode,
  forceRnImplementation,
  testID,
}: {
  action: EgNavBarAction;
  mode: EgNavBarProps['mode'];
  forceRnImplementation?: boolean;
  testID: string;
}) {
  const kind = action.kind ?? 'icon';
  return (
    <EgButtonGlass
      kind={kind}
      icon={action.icon}
      iconCount={action.iconCount}
      iconAlt={action.iconAlt}
      label={action.label}
      size={action.size ?? 'md'}
      disabled={action.disabled}
      onPress={action.onPress}
      accessibilityLabel={action.accessibilityLabel}
      mode={mode}
      forceRnImplementation={forceRnImplementation}
      testID={testID}
    />
  );
}

/** Android / iOS ≤25 — RN 栈：`glass-mask-box` 背景贯穿状态栏 + 左右 icon 胶囊 + 居中标题。 */
export function EgNavBarRn(props: EgNavBarProps) {
  const {
    title,
    left = DEFAULT_LEFT,
    right,
    showLeft = true,
    showTitle = true,
    showRight = true,
    background = 'auto',
    scrollOffset,
    contentUnder = false,
    topInset,
    manageStatusBar = true,
    mode = 'light',
    testID,
    forceRnImplementation,
    style,
  } = props;

  const insets = useSafeAreaInsets();
  const statusZone = topInset ?? insets.top;
  const colors = getThemeColors(mode);

  const [leftWidth, setLeftWidth] = useState(0);
  const [rightWidth, setRightWidth] = useState(0);
  const leftVisible = showLeft;
  const rightVisible = showRight && right != null;
  const sideWidth = Math.max(leftVisible ? leftWidth : 0, rightVisible ? rightWidth : 0);

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

      <View style={styles.row} pointerEvents="box-none">
        <EgNavBarSlot visible={leftVisible} minWidth={sideWidth} align="flex-start" onContentWidth={setLeftWidth}>
          <EgNavBarActionButton
            action={left}
            mode={mode}
            forceRnImplementation={forceRnImplementation}
            testID="nav-bar-left"
          />
        </EgNavBarSlot>

        <Animated.View style={[styles.titleWrap, titleFadeStyle]} pointerEvents="none">
          <Text
            accessibilityRole="header"
            numberOfLines={1}
            ellipsizeMode="tail"
            style={[styles.title, { color: colors['text-base-primary'] as string }]}
          >
            {title ?? ''}
          </Text>
        </Animated.View>

        <EgNavBarSlot visible={rightVisible} minWidth={sideWidth} align="flex-end" onContentWidth={setRightWidth}>
          {right ? (
            <EgNavBarActionButton
              action={right}
              mode={mode}
              forceRnImplementation={forceRnImplementation}
              testID="nav-bar-right"
            />
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
    paddingHorizontal: EG_NAV_BAR_PADDING_HORIZONTAL,
    paddingTop: EG_NAV_BAR_PADDING_TOP,
    paddingBottom: EG_NAV_BAR_PADDING_BOTTOM,
  },
  slot: {
    flexDirection: 'row',
  },
  titleWrap: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: EG_NAV_BAR_TITLE_GAP,
  },
  title: {
    ...presetBodyMediumStrong(),
    textAlign: 'center',
  },
});
