declare module 'react-native' {
  import type { ComponentType, ReactNode } from 'react';
  export type ColorSchemeName = 'light' | 'dark' | null | undefined;
  export type ViewProps = { style?: unknown; testID?: string; accessibilityLabel?: string; children?: ReactNode };
  export const View: ComponentType<ViewProps>;
}

declare module 'react-native-svg' {
  import type { ComponentType } from 'react';
  export const Svg: ComponentType<Record<string, unknown>>;
  export const Path: ComponentType<Record<string, unknown>>;
}

declare module 'react-native-reanimated' {
  export const withSpring: (...args: unknown[]) => unknown;
  export const withTiming: (...args: unknown[]) => unknown;
}
