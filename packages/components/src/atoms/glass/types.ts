import type { ReactNode } from 'react';
import type { ThemeMode } from '../../theme/index.js';
import type { ViewStyle } from 'react-native';

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

export type GlassControlShellProps = {
  shape: GlassControlShape;
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
  /** 内边距 / 最小尺寸 — iOS 原生路径落在 Pressable 上，使整颗胶囊都是热区。 */
  contentStyle?: ViewStyle;
  children: ReactNode;
};
