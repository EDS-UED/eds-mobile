import { EdsSemanticAnima } from '@eds/mobile-animations';
import { EgSearch, type EgSearchHandle } from '@eds/mobile-components';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { parseSearchDemoParams } from '@/data/components/searchDemoParams';
import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseStackNav } from '@/hooks/useShowcaseStackNav';
import { ShowcaseNavBlurBackdrop } from '@/navigation/ShowcaseNavBlurBackdrop';
import { ShowcaseStackScreen } from '@/views/shared/ShowcaseStackScreen';
import { edsSpacing } from '@/views/shared/resolveEdsTheme';
import { showcaseDetailScreenBackgroundColor } from '@/views/shared/showcaseTheme';

const DEMO_TITLE = 'Search 演示';

/**
 * a 贴底。b 距屏幕左右与键盘均为 `spacing-3`。
 * 位置只走 `EdsSemanticAnima('offset').springConfig`。
 */
export function ShowcaseSearchDemoView() {
  const params = useLocalSearchParams<Record<string, string | undefined>>();
  const colors = useShowcaseColors();
  const insets = useSafeAreaInsets();
  const { mode, placeholder, disabled } = parseSearchDemoParams(params);
  const background = showcaseDetailScreenBackgroundColor(colors);
  const { stackScreenOptions, rnNavBar } = useShowcaseStackNav(DEMO_TITLE);
  const searchRef = useRef<EgSearchHandle>(null);

  const [inputFocused, setInputFocused] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [screenHeight, setScreenHeight] = useState(0);

  const restEdge = edsSpacing('spacing-5');
  const inputEdge = edsSpacing('spacing-3');
  const idleBottom = Math.max(insets.bottom, restEdge);
  const offsetSpring = useMemo(() => EdsSemanticAnima('offset').springConfig, []);
  const translateY = useSharedValue(0);
  const appliedShift = useRef<number | null>(null);
  /** 只在弹簧进行时合成。玻璃/模糊跟着改 frame 会在路径上留残影。 */
  const raster = useSharedValue(false);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';
    const showSub = Keyboard.addListener(showEvent, (event) => {
      setKeyboardHeight(event.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const shift = useMemo(() => {
    if (!inputFocused || keyboardHeight <= 0 || screenHeight <= 0) {
      return 0;
    }
    return idleBottom - keyboardHeight - inputEdge;
  }, [idleBottom, inputEdge, inputFocused, keyboardHeight, screenHeight]);

  useEffect(() => {
    if (appliedShift.current === shift) return;
    const first = appliedShift.current === null;
    appliedShift.current = shift;
    if (first) {
      translateY.value = shift;
      return;
    }
    raster.value = true;
    translateY.value = withSpring(shift, offsetSpring, (finished) => {
      if (finished) raster.value = false;
    });
  }, [offsetSpring, raster, shift, translateY]);

  const dockStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    shouldRasterizeIOS: raster.value,
    renderToHardwareTextureAndroid: raster.value,
  }));

  const dismissSearch = () => {
    searchRef.current?.dismiss();
    setInputFocused(false);
  };

  return (
    <ShowcaseStackScreen>
      <Stack.Screen options={stackScreenOptions} />
      {rnNavBar}
      <ShowcaseNavBlurBackdrop>
        <View
          style={[styles.screen, { backgroundColor: background }]}
          onLayout={(event) => setScreenHeight(event.nativeEvent.layout.height)}
        >
          <Pressable
            style={styles.fill}
            accessibilityRole="button"
            accessibilityLabel="Dismiss search"
            onPress={dismissSearch}
          />
          <Animated.View
            collapsable={false}
            style={[
              styles.dock,
              {
                paddingBottom: idleBottom,
                paddingHorizontal: inputFocused ? inputEdge : restEdge,
              },
              dockStyle,
            ]}
          >
            <EgSearch
              ref={searchRef}
              mode={mode}
              placeholder={placeholder}
              disabled={disabled}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={styles.searchChromeReset}
              testID="search-demo"
            />
          </Animated.View>
        </View>
      </ShowcaseNavBlurBackdrop>
    </ShowcaseStackScreen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    overflow: 'visible',
  },
  fill: {
    flex: 1,
  },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    overflow: 'visible',
  },
  searchChromeReset: {
    marginTop: 0,
    marginBottom: 0,
    marginRight: 0,
  },
});
