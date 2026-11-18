import { useEffect, useState } from 'react';
import { scheduleOnRN } from 'react-native-worklets';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

import { getEgNavBarChromeFade } from '../../../organisms/tab-bar/nav-bar/egNavBarChromeFade.js';

/** Checkbox · Radio · Decide — EdsSemanticAnima('fade') 缓入缓出。 */
export function useToggleMarkFadeMotion(active: boolean) {
  const timing = getEgNavBarChromeFade();
  const shellOpacity = useSharedValue(active ? 1 : 0);
  const markOpacity = useSharedValue(active ? 1 : 0);
  const markScale = useSharedValue(active ? 1 : 0.88);
  const [markMounted, setMarkMounted] = useState(active);

  useEffect(() => {
    shellOpacity.value = withTiming(active ? 1 : 0, timing);
    if (active) {
      setMarkMounted(true);
      markOpacity.value = withTiming(1, timing);
      markScale.value = withTiming(1, timing);
      return;
    }
    markOpacity.value = withTiming(0, timing);
    markScale.value = withTiming(0.88, timing, (finished) => {
      if (finished) {
        scheduleOnRN(setMarkMounted, false);
      }
    });
  }, [active, markOpacity, markScale, shellOpacity, timing]);

  const shellAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shellOpacity.value,
  }));

  const markAnimatedStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{ scale: markScale.value }],
  }));

  return { markMounted, markAnimatedStyle, shellAnimatedStyle };
}