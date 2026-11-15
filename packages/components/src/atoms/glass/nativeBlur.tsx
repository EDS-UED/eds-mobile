import type { ComponentRef, ComponentType, ReactNode, RefObject } from 'react';
import { Platform, View, type ViewProps, type ViewStyle } from 'react-native';

type BlurHostView = ComponentRef<typeof View>;

export type NativeBlurMethod = 'none' | 'dimezisBlurView' | 'dimezisBlurViewSdk31Plus';

type BlurViewProps = {
  intensity?: number;
  tint?: 'light' | 'dark' | 'default' | 'prominent' | 'systemMaterial';
  style?: ViewStyle;
  children?: ReactNode;
  blurTarget?: RefObject<BlurHostView | null>;
  blurMethod?: NativeBlurMethod;
  blurReductionFactor?: number;
};

type BlurTargetViewProps = ViewProps & {
  ref?: RefObject<BlurHostView | null>;
};

let BlurViewComponent: ComponentType<BlurViewProps> | null | undefined;
let BlurTargetViewComponent: ComponentType<BlurTargetViewProps> | null | undefined;

export function getNativeBlurView(): ComponentType<BlurViewProps> | null {
  if (BlurViewComponent !== undefined) {
    return BlurViewComponent;
  }

  try {
    BlurViewComponent = require('expo-blur').BlurView as ComponentType<BlurViewProps>;
  } catch {
    BlurViewComponent = null;
  }

  return BlurViewComponent;
}

let expoBlurNativeLinked: boolean | undefined;

/** expo-blur 原生模块已链接（JS 包存在但 dev client 未编入时为 false）。 */
export function isExpoBlurNativeLinked(): boolean {
  if (expoBlurNativeLinked !== undefined) {
    return expoBlurNativeLinked;
  }
  try {
    const expo = require('expo') as { requireOptionalNativeModule: (name: string) => unknown };
    expoBlurNativeLinked = expo.requireOptionalNativeModule('ExpoBlur') != null;
  } catch {
    expoBlurNativeLinked = false;
  }
  return expoBlurNativeLinked;
}

export function getBlurTargetView(): ComponentType<BlurTargetViewProps> | null {
  if (BlurTargetViewComponent !== undefined) {
    return BlurTargetViewComponent;
  }

  try {
    const mod = require('expo-blur');
    BlurTargetViewComponent = mod.BlurTargetView as ComponentType<BlurTargetViewProps>;
  } catch {
    BlurTargetViewComponent = null;
  }

  return BlurTargetViewComponent;
}

/** expo-blur defaults to `none` on Android — must opt in (SDK 55+). */
export function resolveAndroidBlurMethod(): NativeBlurMethod {
  if (Platform.OS !== 'android') {
    return 'none';
  }
  const api =
    typeof Platform.Version === 'number' ? Platform.Version : Number.parseInt(String(Platform.Version), 10);
  if (!Number.isNaN(api) && api >= 31) {
    return 'dimezisBlurViewSdk31Plus';
  }
  return 'dimezisBlurView';
}

export function nativeBlurIntensity(blurPx: number): number {
  return Math.min(100, Math.max(20, Math.round(blurPx * 8)));
}
