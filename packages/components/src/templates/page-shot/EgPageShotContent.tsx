import type { ComponentProps } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';

import type {
  EgEdsAnimaPageShotPageApi,
  EgEdsAnimaPageShotRootApi,
} from '../../shared/motion/EgEdsAnimaPageShot.js';
import { useEgPageShotPullBridge } from '../../shared/motion/egPageShotInteraction.js';
import { getThemeColors, type ThemeMode } from '../../theme/index.js';
import {
  EG_PAGE_CONTENT_PADDING_BOTTOM,
  EG_PAGE_CONTENT_PADDING_HORIZONTAL,
  EG_PAGE_CONTENT_PADDING_TOP,
  resolveEgPageScrollContentStyle,
  resolveEgPageScrollPaddingTop,
} from '../_shared/egPageContentLayout.js';
import { EgPage } from '../page/EgPage.js';
import type { EgPageProps } from '../page/EgPage.types.js';
import { EgPageShotScroll } from './EgPageShotScroll.js';

type EgPageShotLayoutApi = Pick<
  EgEdsAnimaPageShotRootApi,
  'topInset' | 'scrollTopInset' | 'contentInsetAdjustmentBehavior'
>;

export type EgPageShotContentProps = EgPageProps & {
  mode: ThemeMode;
  api: EgPageShotLayoutApi | EgEdsAnimaPageShotPageApi;
};

/**
 * `EgPageShot` 弹层内**唯一**业务滚动入口（根页 / 子页均用本组件，禁止外包裸 `ScrollView`）。
 *
 * - 边距 / inset / NavBar 滚动与 `EgPage` 同轨。
 * - **收回触发卡片**：关页时 shell `page-shot-close` + 本组件内 `EgPageShotScroll` 自动 scroll↔progress 同轨；
 *   业务只调 `api.close()` 或下拉/侧滑关页，**无需** `scrollTo`、token 或 motion 辅助函数。
 */
export function EgPageShotContent({
  mode = 'light',
  api,
  children,
  style,
  contentContainerStyle,
  topInset = api.topInset,
  scrollTopInset = api.scrollTopInset,
  contentInsetAdjustmentBehavior = api.contentInsetAdjustmentBehavior,
  nativeScrollEdge = false,
  contentPaddingHorizontal,
  contentPaddingTop,
  contentPaddingBottom,
  scrollViewRef,
  ...rest
}: EgPageShotContentProps) {
  const pullBridge = useEgPageShotPullBridge();
  const resolvedTop = contentPaddingTop ?? EG_PAGE_CONTENT_PADDING_TOP;
  const paddingTop = resolveEgPageScrollPaddingTop({
    contentInsetAdjustmentBehavior,
    topInset,
    scrollTopInset,
    contentPaddingTop: resolvedTop,
  });
  const colors = getThemeColors(mode);
  const rootStyle = [
    { flex: 1, backgroundColor: colors['box-page'] as string },
    style,
  ] as StyleProp<ViewStyle>;
  const contentStyle = [
    resolveEgPageScrollContentStyle({
      contentPaddingHorizontal:
        contentPaddingHorizontal ?? EG_PAGE_CONTENT_PADDING_HORIZONTAL,
      contentPaddingBottom: contentPaddingBottom ?? EG_PAGE_CONTENT_PADDING_BOTTOM,
    }),
    { paddingTop },
    contentContainerStyle,
  ] as StyleProp<ViewStyle>;

  if (!pullBridge) {
    return (
      <EgPage
        mode={mode}
        topInset={topInset}
        scrollTopInset={scrollTopInset}
        contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
        nativeScrollEdge={nativeScrollEdge}
        style={style}
        contentContainerStyle={contentContainerStyle}
        contentPaddingHorizontal={contentPaddingHorizontal}
        contentPaddingTop={contentPaddingTop}
        contentPaddingBottom={contentPaddingBottom}
        scrollViewRef={scrollViewRef}
        {...rest}
      >
        {children}
      </EgPage>
    );
  }

  return (
    <EgPageShotScroll
      ref={scrollViewRef as ComponentProps<typeof EgPageShotScroll>['ref']}
      style={rootStyle}
      contentContainerStyle={contentStyle}
      contentInsetAdjustmentBehavior={contentInsetAdjustmentBehavior}
      nativeScrollEdge={nativeScrollEdge}
      {...rest}
    >
      {children}
    </EgPageShotScroll>
  );
}