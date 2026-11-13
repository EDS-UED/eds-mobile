import { mobileTheme } from '../../theme/index.js';
import type { ThemeMode } from '../../theme/index.js';
import type { ViewStyle } from 'react-native';

export type GlassBoxClassName =
  | 'glass-button-box'
  | 'glass-flotation-box'
  | 'glass-sheets-box'
  | 'glass-tabbar-box'
  | 'glass-tabbar-bg'
  | 'glass-mask-box';

export type GlassBoxShadowLayer = {
  offsetX: number;
  offsetY: number;
  blurRadius: number;
  spread: number;
  color: string;
  inset: boolean;
};

export type GlassBoxLayer =
  | { kind: 'fill'; color: string }
  | {
      kind: 'overlayGradient';
      angleDeg: number;
      stops: { color: string; position: number }[];
    };

export type GlassBoxComposition = {
  borderRadius?: number;
  border?: { width: number; color: string };
  layers: GlassBoxLayer[];
  shadows: GlassBoxShadowLayer[];
  backdropBlur?: { css: string; radiusPx: number; nativeIntensity: number };
  viewStyle: ViewStyle;
};

const MISSING_GLASS_BOX_COMPOSITION: GlassBoxComposition = {
  layers: [{ kind: 'fill', color: '#ffffff99' }],
  shadows: [],
  viewStyle: { overflow: 'hidden', backgroundColor: 'transparent' },
};

function resolveGlassBoxEntry(className: GlassBoxClassName, mode: ThemeMode) {
  const boxes = mobileTheme.glass?.boxes as Record<string, unknown> | undefined;
  const entry = boxes?.[className] as
    | { light: GlassBoxComposition; dark: GlassBoxComposition }
    | undefined;
  if (!entry) {
    if (typeof __DEV__ !== 'undefined' && __DEV__) {
      console.warn(
        `[EDS] mobileTheme.glass.boxes["${className}"] missing — run pnpm build:tokens`,
      );
    }
    return MISSING_GLASS_BOX_COMPOSITION;
  }
  return (mode === 'dark' ? entry.dark : entry.light) as GlassBoxComposition;
}

export function resolveGlassBoxComposition(
  className: GlassBoxClassName,
  mode: ThemeMode = 'light',
): GlassBoxComposition {
  return resolveGlassBoxEntry(className, mode);
}

export function glassBoxViewStyle(className: GlassBoxClassName, mode: ThemeMode = 'light'): ViewStyle {
  return { ...resolveGlassBoxComposition(className, mode).viewStyle };
}

export function glassBoxNativeBlurIntensity(className: GlassBoxClassName, mode: ThemeMode = 'light'): number {
  return resolveGlassBoxComposition(className, mode).backdropBlur?.nativeIntensity ?? 64;
}
