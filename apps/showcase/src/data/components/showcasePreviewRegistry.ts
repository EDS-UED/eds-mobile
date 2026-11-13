import { resolvePreviewComponent } from '@eds/mobile-components/catalog';
import type { ComponentType } from 'react';

type ShowcasePreviewLoader = () => ComponentType<Record<string, unknown>>;

/** 按需 require · 避免详情页一次性拉齐全部自定义 Preview。 */
const showcasePreviewLoaders: Record<string, ShowcasePreviewLoader> = {
  EgBrandButton: () => require('@/views/components/ShowcaseButtonPreview').ShowcaseButtonPreview,
  EgDecorButton: () => require('@/views/components/ShowcaseButtonPreview').ShowcaseButtonPreview,
  EgDangerButton: () => require('@/views/components/ShowcaseButtonPreview').ShowcaseButtonPreview,
  EgOptionButton: () => require('@/views/components/ShowcaseButtonPreview').ShowcaseButtonPreview,
  ShowcaseEgGlassPreview: () => require('@/views/components/glass/ShowcaseGlassPreviews').ShowcaseEgGlassPreview,
  ShowcaseGlassControlShellPreview: () =>
    require('@/views/components/glass/ShowcaseGlassPreviews').ShowcaseGlassControlShellPreview,
  EgTabBar: () => require('@/views/components/glass/ShowcaseTabBarPreview').ShowcaseTabBarPreview,
  EgCregisTabBar: () => require('@/views/components/glass/ShowcaseCregisTabBarPreview').ShowcaseCregisTabBarPreview,
  EgTabBarGlassBg: () =>
    require('@/views/components/glass/ShowcaseTabBarGlassBgPreview').ShowcaseTabBarGlassBgPreview,
  EgButtonGlass: () => require('@/views/components/glass/ShowcaseGlassButtonPreview').ShowcaseGlassButtonPreview,
  EgNavBar: () => require('@/views/components/glass/ShowcaseNavBarPreview').ShowcaseNavBarPreview,
  EgSheets: () => require('@/views/components/ShowcaseSheetsPreview').ShowcaseSheetsPreview,
  EgDivider: () => require('@/views/components/ShowcaseDividerPreview').ShowcaseDividerPreview,
  EgTab: () => require('@/views/components/ShowcaseEgTabPreview').ShowcaseEgTabPreview,
  EgSymbol: () => require('@/views/components/ShowcaseSymbolPreview').ShowcaseSymbolPreview,
  EgAvatar: () => require('@/views/components/ShowcaseAvatarPreview').ShowcaseAvatarPreview,
  EgAvatarPreset0: () => require('@/views/components/ShowcaseAvatarPreview').ShowcaseAvatarPreset0Preview,
  EgAvatarPreset1: () => require('@/views/components/ShowcaseAvatarPreview').ShowcaseAvatarPreset1Preview,
};

export function resolveShowcasePreviewComponent(
  exportName: string,
): ComponentType<Record<string, unknown>> | null {
  const loader = showcasePreviewLoaders[exportName];
  if (loader) {
    return loader();
  }
  return resolvePreviewComponent(exportName);
}
