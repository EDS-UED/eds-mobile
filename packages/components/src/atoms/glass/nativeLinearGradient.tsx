import type { ComponentType } from 'react';

type LinearGradientPoint = { x: number; y: number };

export type NativeLinearGradientProps = {
  colors: readonly string[];
  locations?: readonly number[] | null;
  start?: LinearGradientPoint;
  end?: LinearGradientPoint;
  style?: object;
  pointerEvents?: 'none' | 'box-none' | 'box-only' | 'auto';
};

let LinearGradientComponent: ComponentType<NativeLinearGradientProps> | null | undefined;

export function getNativeLinearGradient(): ComponentType<NativeLinearGradientProps> | null {
  if (LinearGradientComponent !== undefined) {
    return LinearGradientComponent;
  }

  try {
    LinearGradientComponent = require('expo-linear-gradient').LinearGradient as ComponentType<
      NativeLinearGradientProps
    >;
  } catch {
    LinearGradientComponent = null;
  }

  return LinearGradientComponent;
}
