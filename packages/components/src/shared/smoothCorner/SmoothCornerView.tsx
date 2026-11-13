import type { ComponentType } from 'react';
import { Platform, processColor, View, type ViewProps } from 'react-native';

/** Figma `--corner-smoothing` 60%（同 `@eds/mobile-tokens/corner-smoothing` 默认值）。 */
export const EDS_CORNER_SMOOTHING = 0.6;

const ANDROID_PATH_CLIP_MIN_SDK = 33;

type NativeSmoothCornerProps = ViewProps & {
  radius: number;
  smoothing: number;
  strokeWidth?: number;
  strokeColor?: ReturnType<typeof processColor>;
};

let NativeSmoothCorner: ComponentType<NativeSmoothCornerProps> | null | undefined;

function getNativeSmoothCorner(): ComponentType<NativeSmoothCornerProps> | null {
  if (NativeSmoothCorner !== undefined) {
    return NativeSmoothCorner;
  }
  NativeSmoothCorner = null;
  if (Platform.OS !== 'android' || Number(Platform.Version) < ANDROID_PATH_CLIP_MIN_SDK) {
    return NativeSmoothCorner;
  }
  try {
    const expo = require('expo') as {
      requireOptionalNativeModule: (name: string) => unknown;
      requireNativeView: <P>(moduleName: string, viewName?: string) => ComponentType<P>;
    };
    if (expo.requireOptionalNativeModule('EdsSmoothCorner')) {
      NativeSmoothCorner = expo.requireNativeView<NativeSmoothCornerProps>(
        'EdsSmoothCorner',
        'EdsSmoothCornerView',
      );
    }
  } catch {
    NativeSmoothCorner = null;
  }
  return NativeSmoothCorner;
}

/** Android 13+ 且已链接原生模块（dev client / 正式包；Expo Go 不含）时为 true。 */
export function isAndroidSmoothCornerAvailable(): boolean {
  return getNativeSmoothCorner() != null;
}

export type SmoothCornerViewProps = ViewProps & {
  /** 圆角（dp）；省略 = 跟随父 View 的 `borderRadius`（父层动画圆角时逐帧同步）。 */
  radius?: number;
  /** 沿平滑路径绘制的描边（仅 Android 原生路径；其他端由调用方用 RN `border*`）。 */
  strokeWidth?: number;
  strokeColor?: string;
};

/**
 * 原生增强（Android 平滑圆角）· 用户已声明（2026-11-11）：
 * Android 13+ 以 Outline path 把子视图裁成 Figma 60% squircle；
 * iOS 及其余情况渲染普通 `View`，平滑圆角由调用方 `borderRadius` + `borderCurve: 'continuous'` 负责。
 */
export function SmoothCornerView({
  radius,
  strokeWidth,
  strokeColor,
  children,
  ...rest
}: SmoothCornerViewProps) {
  const Native = getNativeSmoothCorner();
  if (!Native) {
    return <View {...rest}>{children}</View>;
  }
  return (
    <Native
      {...rest}
      radius={radius ?? -1}
      smoothing={EDS_CORNER_SMOOTHING}
      strokeWidth={strokeWidth}
      strokeColor={strokeColor != null ? processColor(strokeColor) : undefined}
    >
      {children}
    </Native>
  );
}
