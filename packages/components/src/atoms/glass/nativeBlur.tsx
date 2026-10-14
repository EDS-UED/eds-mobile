import type { ComponentRef, ComponentType, ReactNode, RefObject } from 'react';
import { Platform, View, type ViewStyle } from 'react-native';

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

type BlurTargetViewProps = {
  ref?: RefObject<BlurHostView | null>;
  style?: ViewStyle;
  children?: ReactNode;
  collapsable?: boolean;
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
  return 'dimezisBlurView';
}

export function nativeBlurIntensity(blurPx: number): number {
  return Math.min(100, Math.max(20, Math.round(blurPx * 8)));
}
