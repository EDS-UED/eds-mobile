import {
  Easing,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import {
  VERIFY_RING_PULSE_MS,
  VERIFY_RING_STAGGER_MS,
} from './sceneTiming.js';

const PULSE_EASING = Easing.bezier(0.05, 0.8, 0.25, 1);

export function startVerifyRingDotPulse(index: number) {
  return withDelay(
    index * VERIFY_RING_STAGGER_MS,
    withRepeat(
      withSequence(
        withTiming(1, { duration: VERIFY_RING_PULSE_MS * 0.08, easing: PULSE_EASING }),
        withTiming(0.72, { duration: VERIFY_RING_PULSE_MS * 0.12, easing: PULSE_EASING }),
        withTiming(0.48, { duration: VERIFY_RING_PULSE_MS * 0.2, easing: PULSE_EASING }),
        withTiming(0.27, { duration: VERIFY_RING_PULSE_MS * 0.25, easing: PULSE_EASING }),
        withTiming(0.15, { duration: VERIFY_RING_PULSE_MS * 0.17, easing: PULSE_EASING }),
        withTiming(0.08, { duration: VERIFY_RING_PULSE_MS * 0.18, easing: PULSE_EASING }),
      ),
      -1,
      false,
    ),
  );
}