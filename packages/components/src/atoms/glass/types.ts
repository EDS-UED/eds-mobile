import type { ReactNode } from 'react';
import type { ThemeMode } from '../../theme/index.js';
import type { ViewStyle } from 'react-native';
import type { MotionPressIntensity } from '../../shared/themeScalars.js';

export type GlassVariant = 'regular' | 'prominent' | 'clear';

export type GlassShape = 'capsule' | 'small' | 'medium' | 'large' | 'circle';

export type ResolvedGlassVariant = {
  surfaceOpacity: number;
  tintOpacity: number;
  borderOpacity: number;
  highlightOpacity: number;
  innerHighlightOpacity: number;
  refraction: number;
  blur: number;
  saturation: number;
};

export type GlassSurfaceProps = {
  variant?: GlassVariant;
  shape?: GlassShape;
  adaptiveContrast?: boolean;
  /** Web：`attachLiquidGlass` 透镜；默认开启，与 liquid-glass 栈一致。 */
  enhancedRefraction?: boolean;
  mode?: ThemeMode;
  style?: ViewStyle;
  testID?: string;
  children?: ReactNode;
};

export type GlassViewProps = GlassSurfaceProps;

export type GlassInteractionProps = {
  press?: boolean;
  /** 点按放大 — `motion-glass-scale-press-*`；默认 `md`。 */
  pressIntensity?: MotionPressIntensity;
  shimmer?: boolean;
  lightResponse?: boolean;
  deformation?: boolean;
  haptic?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
  children: ReactNode;
};

export type GlassContainerProps = {
  morph?: boolean;
  style?: ViewStyle;
  testID?: string;
  children: ReactNode;
};

export type GlassControlShape = 'capsule' | 'circle';

/** `toolbar` — UIKit 工具栏默认几何（spacing-5 等）；`component` — Eg* 仅设外框，内边距由 iOS 26 系统玻璃承担（勿叠 RN padding）。 */
export type GlassControlShellLayout = 'toolbar' | 'component';

export type GlassControlShellProps = {
  shape: GlassControlShape;
  /** @default 'toolbar' */
  shellLayout?: GlassControlShellLayout;
  variant?: GlassVariant;
  mode?: ThemeMode;
  haptic?: boolean;
  disabled?: boolean;
  onPress?: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  testID?: string;
  accessibilityLabel?: string;
  style?: ViewStyle;
  /** Pressable 热区；`shellLayout="component"` 时不写 RN padding（避免与原生 inset 相加）。 */
  contentStyle?: ViewStyle;
  children: ReactNode;
};
