declare module 'react-native' {
  import type { ComponentType, ReactNode } from 'react';

  export type ColorSchemeName = 'light' | 'dark' | null | undefined;
  export type ColorValue = string;
  export type ViewStyle = Record<string, unknown>;
  export type TextStyle = Record<string, unknown>;
  export type StyleProp<T> = T | readonly (T | false | null | undefined)[];

  /** RN-web DOM bridge — used by atom SVG preview slot on web. */
  export function unstable_createElement(
    type: string,
    props?: Record<string, unknown>,
    ...children: unknown[]
  ): ReactNode;

  export type LayoutRectangle = { x: number; y: number; width: number; height: number };
  export type LayoutChangeEvent = { nativeEvent: { layout: LayoutRectangle } };

  export type ViewProps = {
    style?: StyleProp<ViewStyle>;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    accessibilityState?: Record<string, boolean | undefined>;
    onLayout?: (event: LayoutChangeEvent) => void;
    pointerEvents?: 'auto' | 'none' | 'box-none' | 'box-only';
    collapsable?: boolean;
    ref?: import('react').Ref<unknown>;
    onStartShouldSetResponder?: () => boolean;
    accessibilityElementsHidden?: boolean;
    importantForAccessibility?: 'auto' | 'yes' | 'no' | 'no-hide-descendants';
    /** RN-web only — used by atom SVG preview slot. */
    dangerouslySetInnerHTML?: { __html: string };
    children?: ReactNode;
  };

  export type TextProps = {
    style?: StyleProp<TextStyle>;
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    numberOfLines?: number;
    ellipsizeMode?: 'head' | 'middle' | 'tail' | 'clip';
    children?: ReactNode;
  };

  export type StatusBarProps = {
    barStyle?: 'default' | 'light-content' | 'dark-content';
    translucent?: boolean;
    backgroundColor?: string;
    animated?: boolean;
  };

  export type TextInputProps = {
    style?: StyleProp<TextStyle>;
    testID?: string;
    accessibilityLabel?: string;
    value?: string;
    defaultValue?: string;
    placeholder?: string;
    placeholderTextColor?: string;
    editable?: boolean;
    multiline?: boolean;
    autoFocus?: boolean;
    selectTextOnFocus?: boolean;
    onChangeText?: (text: string) => void;
    onFocus?: () => void;
    onBlur?: () => void;
  };

  export type PressableState = { pressed: boolean };

  export type PressableProps = {
    style?: StyleProp<ViewStyle> | ((state: PressableState) => StyleProp<ViewStyle>);
    testID?: string;
    accessibilityLabel?: string;
    accessibilityRole?: string;
    accessibilityState?: Record<string, boolean | undefined>;
    disabled?: boolean;
    delayLongPress?: number;
    onPress?: () => void;
    onPressIn?: () => void;
    onPressOut?: () => void;
    children?: ReactNode | ((state: PressableState) => ReactNode);
  };

  export type ActivityIndicatorProps = {
    color?: string;
    size?: 'small' | 'large' | number;
    testID?: string;
  };

  export type ScrollViewProps = {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    keyboardShouldPersistTaps?: 'always' | 'never' | 'handled' | boolean;
    nestedScrollEnabled?: boolean;
    scrollEnabled?: boolean;
    showsVerticalScrollIndicator?: boolean;
    bounces?: boolean;
    onScroll?: (event: { nativeEvent: { contentOffset: { x: number; y: number } } }) => void;
    scrollEventThrottle?: number;
    scrollIndicatorInsets?: { top?: number; bottom?: number; left?: number; right?: number };
    contentInsetAdjustmentBehavior?: 'automatic' | 'scrollableAxes' | 'never' | 'always';
    onContentSizeChange?: (width: number, height: number) => void;
    ref?: import('react').Ref<{ scrollTo: (options: { y: number; animated?: boolean }) => void }>;
    children?: ReactNode;
  };

  export type ModalProps = {
    visible?: boolean;
    transparent?: boolean;
    animationType?: 'none' | 'slide' | 'fade';
    onRequestClose?: () => void;
    onShow?: () => void;
    /** Android — 蒙层铺满状态栏，避免系统条纯色底。 */
    statusBarTranslucent?: boolean;
    children?: ReactNode;
  };

  export type ImageSourcePropType = number | { uri: string };

  export type ImageProps = {
    source: ImageSourcePropType;
    style?: StyleProp<ViewStyle>;
    resizeMode?: 'cover' | 'contain' | 'stretch' | 'center';
    accessibilityLabel?: string;
    testID?: string;
  };

  export const View: ComponentType<ViewProps>;
  export const Image: ComponentType<ImageProps>;
  export const Text: ComponentType<TextProps>;
  export const TextInput: ComponentType<TextInputProps>;
  export const Pressable: ComponentType<PressableProps>;
  export const ScrollView: ComponentType<ScrollViewProps>;
  export const Modal: ComponentType<ModalProps>;
  export const ActivityIndicator: ComponentType<ActivityIndicatorProps>;
  export const StatusBar: ComponentType<StatusBarProps>;

  export const StyleSheet: {
    create<T extends Record<string, ViewStyle | TextStyle>>(styles: T): T;
    flatten<T>(style: StyleProp<T> | StyleProp<T>[]): T;
    /** RN 0.86+ 已移除 `absoluteFillObject`（运行时为 undefined）。 */
    absoluteFill: ViewStyle;
    hairlineWidth: number;
  };

  export function processColor(color: ColorValue | null | undefined): number | null | undefined;

  export const Platform: {
    OS: 'ios' | 'android' | 'web' | 'windows' | 'macos';
    /** Android = API level（number）；iOS = 系统版本（string）。 */
    Version: number | string;
    select<T>(specifics: {
      ios?: T;
      android?: T;
      native?: T;
      web?: T;
      default?: T;
    }): T;
  };

  export const Dimensions: {
    get(dim: 'window' | 'screen'): { width: number; height: number; scale: number; fontScale: number };
  };

  export const AccessibilityInfo: {
    isReduceMotionEnabled: () => Promise<boolean>;
    addEventListener?: (
      event: 'reduceMotionChanged',
      handler: (enabled: boolean) => void,
    ) => { remove: () => void };
  };

  export const Easing: {
    bezier: (x1: number, y1: number, x2: number, y2: number) => (value: number) => number;
    out: (easing: (value: number) => number) => (value: number) => number;
    cubic: (value: number) => number;
  };

  /** RN Animated（`@react-navigation/stack` cardStyleInterpolator 用）。 */
  export namespace Animated {
    type InterpolationConfig = {
      inputRange: number[];
      outputRange: number[];
      extrapolate?: 'extend' | 'clamp' | 'identity';
    };
    class AnimatedInterpolation<T> {
      interpolate(config: InterpolationConfig): AnimatedInterpolation<T>;
    }
    class Value extends AnimatedInterpolation<number> {
      constructor(value: number);
      setValue(value: number): void;
    }
    function multiply(
      a: AnimatedInterpolation<number> | number,
      b: AnimatedInterpolation<number> | number,
    ): AnimatedInterpolation<number>;
  }
}

declare module 'react-native-svg' {
  import type { ComponentType } from 'react';
  export const Svg: ComponentType<Record<string, unknown>>;
  export const Path: ComponentType<Record<string, unknown>>;
  export const Circle: ComponentType<Record<string, unknown>>;
  export const SvgXml: ComponentType<{
    xml: string;
    width?: number | string;
    height?: number | string;
  }>;
}

declare module 'react-native-reanimated' {
  import type { ComponentType } from 'react';
  export const withSpring: (
    value: number,
    config?: Record<string, number>,
    callback?: (finished?: boolean) => void,
  ) => number;
  export const withTiming: (
    value: number,
    config?: { duration?: number; easing?: (value: number) => number },
    callback?: (finished?: boolean) => void,
  ) => number;
  export const withDelay: (delayMs: number, animation: number) => number;
  export const cancelAnimation: (sharedValue: { value: unknown }) => void;
  export enum Extrapolation {
    IDENTITY = 'identity',
    CLAMP = 'clamp',
    EXTEND = 'extend',
  }
  export function interpolate(
    value: number,
    input: readonly number[],
    output: readonly number[],
    extrapolate?: Extrapolation,
  ): number;
  export function useReducedMotion(): boolean;
  export function useAnimatedReaction<T>(
    prepare: () => T,
    react: (current: T, previous: T | null) => void,
    dependencies?: ReadonlyArray<unknown>,
  ): void;
  export const Easing: {
    bezier: (
      x1: number,
      y1: number,
      x2: number,
      y2: number,
    ) => (value: number) => number;
  };
  export const useSharedValue: <T>(initial: T) => { value: T };
  export function useDerivedValue<T>(
    updater: () => T,
    dependencies?: ReadonlyArray<unknown>,
  ): { readonly value: T };
  export function useAnimatedStyle(
    factory: () => Record<string, unknown>,
    dependencies?: ReadonlyArray<unknown>,
  ): Record<string, unknown>;
  export function createAnimatedComponent<P>(component: ComponentType<P>): ComponentType<P>;
  const Animated: {
    createAnimatedComponent: typeof createAnimatedComponent;
    View: ComponentType<Record<string, unknown>>;
    Text: ComponentType<Record<string, unknown>>;
  };
  export default Animated;
}

declare module '@eds/mobile-tokens/liquid-glass' {
  export function attachLiquidGlass(node: HTMLElement): void;
  export function detachLiquidGlass(node: HTMLElement): void;
}

declare module '@eds/mobile-animations' {
  export function EdsRecipeAnima(id: string): {
    springConfig?: Record<string, number>;
    timingConfig?: { duration?: number; easing?: readonly number[] };
  };
  export function EdsSemanticAnima(scenario: string): {
    semanticClass: string;
    recipeId: string | null;
    springConfig?: Record<string, number>;
    timingConfig?: { duration?: number; easing?: readonly number[] };
  };
}
