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

  return {
    headerShown: true,
    headerTransparent: true,
    headerShadowVisible: false,
    title: showTitle ? (title ?? '') : '',
    headerTitleAlign: 'center',
    headerTitleStyle: {
      fontSize: titlePreset.fontSize as number,
      fontWeight: '600',
      fontFamily: font.fontFamily,
      color,
    },
    headerBackVisible: showLeft && left == null,
    headerLeft: showLeft && left ? () => <NativeBarItem action={left} color={color} /> : showLeft ? undefined : () => null,
    headerRight: showRight && right ? () => <NativeBarItem action={right} color={color} /> : undefined,
    scrollEdgeEffects: { top: SCROLL_EDGE[background] },
  };
}

const styles = StyleSheet.create({
  icons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: itemGap,
  },
});
