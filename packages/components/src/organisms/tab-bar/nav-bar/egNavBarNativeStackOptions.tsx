import type { ReactElement, ReactNode } from 'react';
import { EgNavBarActionView } from './EgNavBarActionView.js';
import { edsFontStyle } from '../../../shared/fontFamily.js';
import { presetBodyMediumStrong } from '../../../shared/typographyStyles.js';
import { getThemeColors } from '../../../theme/index.js';
import type {
  EgNavBarAction,
  EgNavBarBackground,
  EgNavBarProps,
  EgNavBarScrollEdgeEffect as ScrollEdgeEffect,
} from './EgNavBar.types.js';

/** expo-router `Stack.Screen options` / native-stack `screenOptions` 子集。 */
export type EgNavBarNativeStackOptions = {
  headerShown: true;
  headerTransparent: true;
  headerShadowVisible: false;
  title: string;
  headerTitleAlign: 'center';
  headerTitleStyle: { fontSize: number; fontWeight: '600'; fontFamily?: string; color: string };
  headerBackVisible: boolean;
  /** iOS 26+ 自定义栏须走 `unstable_header*Items`；legacy 槽勿塞 `EgButtonGlass`。 */
  headerLeft?: () => ReactNode;
  headerRight?: () => ReactNode;
  unstable_headerLeftItems?: () => ReturnType<typeof egNavBarNativeStackHeaderGlassItem>[];
  unstable_headerRightItems?: () => ReturnType<typeof egNavBarNativeStackHeaderGlassItem>[];
  scrollEdgeEffects: { top: ScrollEdgeEffect };
};

export type EgNavBarNativeStackOptionsInput = Pick<
  EgNavBarProps,
  | 'title'
  | 'left'
  | 'right'
  | 'showLeft'
  | 'showTitle'
  | 'showRight'
  | 'background'
  | 'scrollEdgeEffect'
  | 'mode'
> & {
  /** `background="auto"` — 内容已滚入栏下（`useEgNavBarScroll().scrollEdgeActive`）；静止 `hidden` · 滚入 `soft`。 */
  scrollEdgeActive?: boolean;
};

/** 系统栏 scroll edge：`auto` 静止隐藏、内容滚入栏下为 `soft`；`visible` 常显 `hard`；`hidden` 常隐。 */
export function resolveEgNavBarScrollEdge(
  background: EgNavBarBackground,
  scrollEdgeActive = false,
): ScrollEdgeEffect {
  if (background === 'visible') return 'hard';
  if (background === 'hidden') return 'hidden';
  return scrollEdgeActive ? 'soft' : 'hidden';
}

/**
 * iOS 26+ 系统栏 scroll edge 依赖非空 `title`；`showTitle: false` 时仍须保留文案并透明隐藏。
 * 未传或全空白时用单空格占位（勿下发 `''`）。
 */
export function resolveEgNavBarNativeStackTitle(title: string | undefined): string {
  const trimmed = title?.trim();
  return trimmed ? trimmed : ' ';
}

function NativeBarItem({ action, mode }: { action: EgNavBarAction; mode: EgNavBarProps['mode'] }) {
  return <EgNavBarActionView action={action} mode={mode} />;
}

/** iOS 26+ — 单颗栏项；须配合 `unstable_header*Items` + `hidesSharedBackground`（勿用 legacy `headerLeft` 叠 GlassView）。 */
export function egNavBarNativeStackHeaderGlassItem(
  element: ReactElement,
): {
  type: 'custom';
  element: ReactElement;
  hidesSharedBackground: true;
} {
  return { type: 'custom', element, hidesSharedBackground: true };
}

/**
 * iOS 26+ — 导航栏交给系统 `UINavigationBar`（Liquid Glass + scroll edge effect）。
 * 自定义栏项：`EgNavBarActionView`（`EgButtonGlass`）+ `unstable_header*Items`（`egNavBarNativeStackHeaderGlassItem`）。
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
    scrollEdgeEffect,
    scrollEdgeActive = false,
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
    headerLeft: undefined,
    headerRight: undefined,
    unstable_headerLeftItems:
      showLeft && left
        ? () => [egNavBarNativeStackHeaderGlassItem(<NativeBarItem action={left} mode={mode} />)]
        : showLeft
          ? undefined
          : () => [],
    unstable_headerRightItems:
      showRight && right
        ? () => [egNavBarNativeStackHeaderGlassItem(<NativeBarItem action={right} mode={mode} />)]
        : undefined,
    scrollEdgeEffects: { top: scrollEdgeEffect ?? resolveEgNavBarScrollEdge(background, scrollEdgeActive) },
  };
}

export type EgNavBarNativeStackScreenOptionsInput = Pick<
  EgNavBarProps,
  'background' | 'scrollEdgeEffect' | 'mode'
> & {
  /** 返回动作（Stack `screenOptions` 回调里的 `navigation.goBack`）。 */
  onBack: () => void;
  /** 返回钮无障碍文案（默认「返回」）。 */
  backAccessibilityLabel?: string;
};

/**
 * iOS 26+ — 整个 Stack 的 `screenOptions`：系统 `UINavigationBar` + EDS 标题 / 返回。
 * 标题由各路由 `title` / `<Stack.Title>` 提供；栈底页无返回。
 */
export function egNavBarNativeStackScreenOptions({
  onBack,
  background = 'auto',
  scrollEdgeEffect,
  mode = 'light',
  backAccessibilityLabel = '返回',
}: EgNavBarNativeStackScreenOptionsInput) {
  const { title: _title, headerLeft: _left, headerRight: _right, ...base } = egNavBarNativeStackOptions({
    background,
    scrollEdgeEffect,
    mode,
  });
  const back: EgNavBarAction = {
    kind: 'icon',
    icon: 'eds-arrow-left-ios',
    accessibilityLabel: backAccessibilityLabel,
    onPress: onBack,
  };

  return {
    ...base,
    headerLargeTitleEnabled: false,
    headerBackVisible: false,
    headerLeft: undefined,
    unstable_headerLeftItems: ({ canGoBack }: { canGoBack?: boolean }) =>
      canGoBack
        ? [egNavBarNativeStackHeaderGlassItem(<NativeBarItem action={back} mode={mode} />)]
        : [],
  };
}

