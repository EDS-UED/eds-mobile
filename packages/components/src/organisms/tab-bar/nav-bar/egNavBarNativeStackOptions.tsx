import type { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { EgSymbol } from '../../../atoms/_shared/symbol/EgSymbol.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { buttonTypography, presetBodyMediumStrong } from '../../../shared/typographyStyles.js';
import { getThemeColors } from '../../../theme/index.js';
import { mobileTheme } from '../../../theme/index.js';
import type { EgNavBarAction, EgNavBarBackground, EgNavBarProps } from './EgNavBar.types.js';

type ScrollEdgeEffect = 'automatic' | 'hard' | 'soft' | 'hidden';

/** expo-router `Stack.Screen options` / native-stack `screenOptions` 子集。 */
export type EgNavBarNativeStackOptions = {
  headerShown: true;
  headerTransparent: true;
  headerShadowVisible: false;
  title: string;
  headerTitleAlign: 'center';
  headerTitleStyle: { fontSize: number; fontWeight: '600'; fontFamily?: string; color: string };
  headerBackVisible: boolean;
  headerLeft?: () => ReactNode;
  headerRight?: () => ReactNode;
  scrollEdgeEffects: { top: ScrollEdgeEffect };
};

export type EgNavBarNativeStackOptionsInput = Pick<
  EgNavBarProps,
  'title' | 'left' | 'right' | 'showLeft' | 'showTitle' | 'showRight' | 'background' | 'mode'
>;

const SCROLL_EDGE: Record<EgNavBarBackground, ScrollEdgeEffect> = {
  auto: 'automatic',
  visible: 'hard',
  hidden: 'hidden',
};

/**
 * iOS 26+ 系统栏 scroll edge 依赖非空 `title`；`showTitle: false` 时仍须保留文案并透明隐藏。
 * 未传或全空白时用单空格占位（勿下发 `''`）。
 */
export function resolveEgNavBarNativeStackTitle(title: string | undefined): string {
  const trimmed = title?.trim();
  return trimmed ? trimmed : ' ';
}

const itemGap = mobileTheme.spacing['spacing-4'] as number;

function NativeBarItem({ action, color }: { action: EgNavBarAction; color: string }) {
  const kind = action.kind ?? 'icon';
  const iconCount = action.iconCount === 2 ? 2 : 1;
  return (
    <Pressable
      onPress={action.onPress}
      disabled={action.disabled}
      accessibilityRole="button"
      accessibilityLabel={action.accessibilityLabel ?? (kind === 'text' ? action.label : action.icon)}
    >
      {kind === 'text' ? (
        <Text style={[buttonTypography(action.size ?? 'md'), { color }]}>{action.label ?? ''}</Text>
      ) : (
        <View style={styles.icons}>
          <EgSymbol name={action.icon ?? 'eds-list-lattice-mobile'} size="md" />
          {iconCount === 2 ? <EgSymbol name={action.iconAlt ?? action.icon ?? 'eds-add'} size="md" /> : null}
        </View>
      )}
    </Pressable>
  );
}

/**
 * iOS 26+ — 导航栏交给系统 `UINavigationBar`（Liquid Glass + scroll edge effect）。
 * 栏项内容不再包 `EgButtonGlass`：系统已为 bar item 提供玻璃底，避免双层玻璃。
 *
 * `<Stack.Screen options={egNavBarNativeStackOptions({ title: '详情' })} />`
 */
export function egNavBarNativeStackOptions(input: EgNavBarNativeStackOptionsInput): EgNavBarNativeStackOptions {
  const {
    title,
    left,
    right,
    showLeft = true,
    showTitle = true,
    showRight = true,
    background = 'auto',
    mode = 'light',
  } = input;
  const color = getThemeColors(mode)['text-base-primary'] as string;
  const titlePreset = presetBodyMediumStrong();
  const font = edsFontStyle('600') as { fontFamily?: string };
  const nativeTitle = resolveEgNavBarNativeStackTitle(title);

  return {
    headerShown: true,
    headerTransparent: true,
    headerShadowVisible: false,
    title: nativeTitle,
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: titlePreset.fontSize as number,
      fontWeight: '600',
      fontFamily: font.fontFamily,
      color: showTitle ? color : 'transparent',
    },
    headerBackVisible: showLeft && left == null,
    headerLeft: showLeft && left ? () => <NativeBarItem action={left} color={color} /> : showLeft ? undefined : () => null,
    headerRight: showRight && right ? () => <NativeBarItem action={right} color={color} /> : undefined,
    scrollEdgeEffects: { top: SCROLL_EDGE[background] },
  };
}

export type EgNavBarNativeStackScreenOptionsInput = Pick<EgNavBarProps, 'background' | 'mode'> & {
  /** 返回动作（Stack `screenOptions` 回调里的 `navigation.goBack`）。 */
  onBack: () => void;
};

/**
 * iOS 26+ — 整个 Stack 的 `screenOptions`：系统 `UINavigationBar` + EDS 标题 / 返回。
 * 标题由各路由 `title` / `<Stack.Title>` 提供；栈底页无返回。
 */
export function egNavBarNativeStackScreenOptions({
  onBack,
  background = 'auto',
  mode = 'light',
}: EgNavBarNativeStackScreenOptionsInput) {
  const { title: _title, headerLeft: _left, headerRight: _right, ...base } = egNavBarNativeStackOptions({
    background,
    mode,
  });
  const color = getThemeColors(mode)['text-base-primary'] as string;
  const back: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: '返回',
    onPress: onBack,
  };

  return {
    ...base,
    headerLargeTitleEnabled: false,
    headerBackVisible: false,
    headerLeft: ({ canGoBack }: { canGoBack?: boolean }) =>
      canGoBack ? <NativeBarItem action={back} color={color} /> : null,
  };
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: itemGap,
  },
});
