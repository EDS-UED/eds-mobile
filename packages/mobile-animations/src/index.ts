/** iOS-native motion — sourced from packages/tokens/spec/motion/ios-native.json */
export const iosSpringDefault = { damping: 18, stiffness: 220, mass: 1 } as const;
export const iosSpringSnappy = { damping: 22, stiffness: 320, mass: 0.9 } as const;
export const iosSpringGentle = { damping: 20, stiffness: 160, mass: 1 } as const;
export const iosSpringBouncy = { damping: 12, stiffness: 180, mass: 1 } as const;

export const iosTimingEaseInOut = { duration: 350, easing: [0.42, 0, 0.58, 1] as const };
export const iosTimingEaseOut = { duration: 300, easing: [0, 0, 0.58, 1] as const };
export const iosTimingEaseIn = { duration: 250, easing: [0.42, 0, 1, 1] as const };
export const iosTimingNavigationPush = { duration: 350, easing: [0.32, 0.72, 0, 1] as const };

export const mobileMotion = {
  spring: {
    default: iosSpringDefault,
    snappy: iosSpringSnappy,
    gentle: iosSpringGentle,
    bouncy: iosSpringBouncy,
  },
  timing: {
    easeInOut: iosTimingEaseInOut,
    easeOut: iosTimingEaseOut,
    easeIn: iosTimingEaseIn,
    navigationPush: iosTimingNavigationPush,
  },
} as const;

export default mobileMotion;
