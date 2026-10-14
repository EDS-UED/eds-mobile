import type { ComponentType, ReactNode } from 'react';
import { Platform } from 'react-native';
import type { ViewStyle } from 'react-native';

export type AndroidLiquidGlassViewProps = {
  style?: ViewStyle;
  cornerRadius?: number;
  renderFallback?: (props: { style?: ViewStyle; children?: ReactNode }) => ReactNode;
  children?: ReactNode;
};

let AndroidLiquidGlassViewComponent: ComponentType<AndroidLiquidGlassViewProps> | null | undefined;

export function getAndroidLiquidGlassView(): ComponentType<AndroidLiquidGlassViewProps> | null {
  if (AndroidLiquidGlassViewComponent !== undefined) {
    return AndroidLiquidGlassViewComponent;
  }

  if (Platform.OS !== 'android') {
    AndroidLiquidGlassViewComponent = null;
    return AndroidLiquidGlassViewComponent;
  }

  try {
    const mod = require('react-native-android-liquid-glass') as {
      LiquidGlassAndroidView?: ComponentType<AndroidLiquidGlassViewProps>;
    };
    AndroidLiquidGlassViewComponent = mod.LiquidGlassAndroidView ?? null;
  } catch {
    AndroidLiquidGlassViewComponent = null;
  }

  return AndroidLiquidGlassViewComponent;
}

export function isAndroidLiquidGlassAvailable(): boolean {
  return getAndroidLiquidGlassView() != null;
}
