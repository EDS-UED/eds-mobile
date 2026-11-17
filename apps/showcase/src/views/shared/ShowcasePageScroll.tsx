import {
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EgPage,
  type EgPageProps,
  type EgPageScrollViewHandle,
} from '@eds/mobile-components';
import type { ReactNode, Ref } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import { useShowcaseColors } from '@/hooks/useShowcaseColors';
import { useShowcaseTabBarInset } from '@/hooks/useShowcaseTabBarInset';
import { showcaseNavScrollInset } from '@/navigation/showcaseNavScrollShell';
import { useShowcaseThemeContext } from '@/theme/ShowcaseThemeProvider';
import { showcasePageBackgroundColor } from '@/views/shared/showcaseTheme';
import { showcaseDocPageSectionsContainerStyle } from '@/views/shared/showcaseDocSectionLayout';
import { showcaseTheme as theme } from '@/views/shared/showcaseTheme';

export type ShowcasePageScrollProps = {
  nativeStackNav: boolean;
  rnScrollPaddingTop: number;
  children: ReactNode;
  /** 在 `EgPage` 底距（spacing-10 · 40px）之上追加 · 如固定 Footer。 */
  bottomInsetExtra?: number;
  /** 默认随路由叠 Tab 条占位。 */
  withTabBarInset?: boolean;
  /** 区块间距 · 默认 spacing-4。 */
  sectionGap?: boolean;
  /** 文档多区块 — `docSectionCardGap`（与三级族页一致）；关闭默认 `cardGap`。 */
  docSectionStack?: boolean;
  style?: EgPageProps['style'];
  contentContainerStyle?: StyleProp<ViewStyle>;
  onScroll?: EgPageProps['onScroll'];
  scrollEventThrottle?: EgPageProps['scrollEventThrottle'];
  nativeScrollEdge?: EgPageProps['nativeScrollEdge'];
  contentInsetAdjustmentBehavior?: EgPageProps['contentInsetAdjustmentBehavior'];
  nestedScrollEnabled?: boolean;
  keyboardShouldPersistTaps?: EgPageProps['keyboardShouldPersistTaps'];
  scrollIndicatorInsets?: EgPageProps['scrollIndicatorInsets'];
  scrollViewRef?: Ref<EgPageScrollViewHandle>;
  /** 内容顶边距（px）· Tab 首页传 `0`；未传则 EgPage 默认 lg 12。 */
  contentPaddingTop?: number;
  stickyHeaderIndices?: number[];
};

/** Showcase 路由页滚动壳 — 边距与业务一致，走 `EgPage` + Tab/Footer 额外 `paddingBottom`。 */
export function ShowcasePageScroll({
  nativeStackNav,
  rnScrollPaddingTop,
  children,
  bottomInsetExtra = 0,
  withTabBarInset = true,
  sectionGap = true,
  docSectionStack = false,
  style,
  contentContainerStyle,
  onScroll,
  scrollEventThrottle,
  nativeScrollEdge = false,
  contentInsetAdjustmentBehavior,
  nestedScrollEnabled,
  keyboardShouldPersistTaps,
  scrollIndicatorInsets,
  scrollViewRef,
  contentPaddingTop,
  stickyHeaderIndices,
}: ShowcasePageScrollProps) {
  const { colorTheme } = useShowcaseThemeContext();
  const colors = useShowcaseColors();
  const tabBarInset = useShowcaseTabBarInset();
  const pageBackground = showcasePageBackgroundColor(colors);
  const insetBehavior = contentInsetAdjustmentBehavior ?? showcaseNavScrollInset(nativeStackNav);
  const tabExtra = withTabBarInset ? tabBarInset : 0;
  const sectionStackGap = docSectionStack
    ? showcaseDocPageSectionsContainerStyle
    : sectionGap
      ? { gap: theme.layout.cardGap }
      : null;

  return (
    <EgPage
      scrollViewRef={scrollViewRef as EgPageProps['scrollViewRef']}
      mode={colorTheme}
      style={[{ backgroundColor: pageBackground }, style]}
      contentInsetAdjustmentBehavior={insetBehavior}
      topInset={nativeStackNav ? 0 : rnScrollPaddingTop}
      scrollTopInset={nativeStackNav ? undefined : rnScrollPaddingTop}
      contentPaddingTop={contentPaddingTop}
      onScroll={onScroll}
      scrollEventThrottle={scrollEventThrottle}
      nativeScrollEdge={nativeScrollEdge}
      nestedScrollEnabled={nestedScrollEnabled}
      keyboardShouldPersistTaps={keyboardShouldPersistTaps}
      scrollIndicatorInsets={scrollIndicatorInsets}
      stickyHeaderIndices={stickyHeaderIndices}
      contentContainerStyle={[
        sectionStackGap,
        {
          paddingBottom: EG_PAGE_CONTENT_PADDING_BOTTOM + tabExtra + bottomInsetExtra,
        },
        contentContainerStyle,
      ]}
    >
      {children}
    </EgPage>
  );
}