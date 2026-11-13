import type { ComponentType } from 'react';
import type { ViewProps } from 'react-native';

export type NativeGlassViewProps = ViewProps & {
  glassEffectStyle?: 'clear' | 'regular' | 'none';
  colorScheme?: 'auto' | 'light' | 'dark';
  isInteractive?: boolean;
};

export type NativeGlassContainerProps = ViewProps & {
  spacing?: number;
};

let GlassViewComponent: ComponentType<NativeGlassViewProps> | null | undefined;
let GlassContainerComponent: ComponentType<NativeGlassContainerProps> | null | undefined;
let liquidGlassAvailable: boolean | undefined;

export function getNativeGlassView(): ComponentType<NativeGlassViewProps> | null {
  if (GlassViewComponent !== undefined) {
    return GlassViewComponent;
  }

  try {
    GlassViewComponent = require('expo-glass-effect').GlassView as ComponentType<NativeGlassViewProps>;
  } catch {
    GlassViewComponent = null;
  }

  return GlassViewComponent;
}

export function getNativeGlassContainer(): ComponentType<NativeGlassContainerProps> | null {
  if (GlassContainerComponent !== undefined) {
    return GlassContainerComponent;
  }

  try {
    GlassContainerComponent = require('expo-glass-effect').GlassContainer as ComponentType<
      NativeGlassContainerProps
    >;
  } catch {
    GlassContainerComponent = null;
  }

  return GlassContainerComponent;
}

export function isNativeLiquidGlassAvailable(): boolean {
  if (liquidGlassAvailable !== undefined) {
    return liquidGlassAvailable;
  }

  try {
    if (!getNativeGlassView()) {
      liquidGlassAvailable = false;
      return false;
    }
    const mod = require('expo-glass-effect');
    const runtimeApi = Boolean(mod.isGlassEffectAPIAvailable?.());
    if (!runtimeApi) {
      liquidGlassAvailable = false;
      return false;
    }
    // `isLiquidGlassAvailable` = 编译进宿主 App 的能力（Expo Go 常为 false）；
    // 运行时以 `isGlassEffectAPIAvailable` 为准（expo #40911），避免 EgButtonGlass 误走 RN。
    const compiled = Boolean(mod.isLiquidGlassAvailable?.());
    liquidGlassAvailable = compiled || runtimeApi;
  } catch {
    liquidGlassAvailable = false;
  }

  return liquidGlassAvailable;
}
