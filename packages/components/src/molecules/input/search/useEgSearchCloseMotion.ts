import { useEffect, useRef, useState } from 'react';
import { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';

import { mobileTheme } from '../../../theme/index.js';
import { EG_SEARCH_CLOSE_GAP } from './egSearchMetrics.js';
import { resolveEgSearchDeformMotion } from './egSearchLayoutMotion.js';

const CLOSE_CAPSULE_SIZE = mobileTheme.spacing['capsule-md'] as number;
const deform = resolveEgSearchDeformMotion();

/**
 * 输入框变窄 / 还原 · `EdsSemanticAnima('deform')`。
 * 关闭钮入场 scale 0→1、离场 1→0，同一几何 timing。
 */
export function useEgSearchCloseMotion(active: boolean, motionEnabled = true) {
  const reserveWidth = EG_SEARCH_CLOSE_GAP + CLOSE_CAPSULE_SIZE;
  const slotWidth = useSharedValue(active ? reserveWidth : 0);
  const closeScale = useSharedValue(active ? 1 : 0);
  const [closeMounted, setCloseMounted] = useState(active);
  const prevActive = useRef<boolean | null>(null);

  useEffect(() => {
    if (prevActive.current === active) {
      return;
    }
    const was = prevActive.current;
    prevActive.current = active;

    if (was === null && !active) {
      slotWidth.value = 0;
      closeScale.value = 0;
      setCloseMounted(false);
      return;
    }

    if (!motionEnabled) {
      setCloseMounted(active);
      slotWidth.value = active ? reserveWidth : 0;
      closeScale.value = active ? 1 : 0;
      return;
    }

    if (active) {
      setCloseMounted(true);
      closeScale.value = 0;
      slotWidth.value = withTiming(reserveWidth, deform.geometryTiming);
      closeScale.value = withTiming(1, deform.geometryTiming);
      return;
    }

    slotWidth.value = withTiming(0, deform.geometryTiming);
    closeScale.value = withTiming(0, deform.geometryTiming, (finished) => {
      if (finished) {
        scheduleOnRN(setCloseMounted, false);
      }
    });
  }, [active, closeScale, motionEnabled, reserveWidth, slotWidth]);

  const slotStyle = useAnimatedStyle(() => ({
    width: slotWidth.value,
  }));

  const closeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: closeScale.value }],
  }));

  return {
    closeMounted,
    closeCapsuleSize: CLOSE_CAPSULE_SIZE,
    closeGap: EG_SEARCH_CLOSE_GAP,
    slotStyle,
    closeStyle,
  };
}
