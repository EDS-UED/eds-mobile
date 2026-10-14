import { Platform } from 'react-native';

/** Optional `expo-haptics` — no hard dependency on `@eds/mobile-components`. */
export function triggerGlassPressHaptic(): void {
  if (Platform.OS !== 'ios') return;

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const Haptics = require('expo-haptics') as {
      impactAsync: (style: unknown) => Promise<void>;
      ImpactFeedbackStyle: { Light: unknown };
    };
    void Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch {
    // expo-haptics not installed in consumer
  }
}
