import { resolvePreviewComponent } from '@eds/mobile-components/catalog';
import type { ComponentType } from 'react';

import {
  ShowcaseEgGlassPreview,
  ShowcaseGlassControlShellPreview,
} from '@/views/components/glass/ShowcaseGlassPreviews';
import { ShowcaseTabBarGlassBgPreview } from '@/views/components/glass/ShowcaseTabBarGlassBgPreview';
import { ShowcaseCregisTabBarPreview } from '@/views/components/glass/ShowcaseCregisTabBarPreview';
import { ShowcaseTabBarPreview } from '@/views/components/glass/ShowcaseTabBarPreview';
import { ShowcaseButtonPreview } from '@/views/components/ShowcaseButtonPreview';
import { ShowcaseGlassButtonPreview } from '@/views/components/glass/ShowcaseGlassButtonPreview';
import { ShowcaseNavBarPreview } from '@/views/components/glass/ShowcaseNavBarPreview';
import {
  ShowcaseAvatarPreset0Preview,
  ShowcaseAvatarPreset1Preview,
  ShowcaseAvatarPreview,
} from '@/views/components/ShowcaseAvatarPreview';
import { ShowcaseDividerPreview } from '@/views/components/ShowcaseDividerPreview';
import { ShowcaseSymbolPreview } from '@/views/components/ShowcaseSymbolPreview';

const buttonScenePreview = ShowcaseButtonPreview as ComponentType<Record<string, unknown>>;

const showcasePreviewByExport: Record<string, ComponentType<Record<string, unknown>>> = {
  EgBrandButton: buttonScenePreview,
  EgDecorButton: buttonScenePreview,
  EgDangerButton: buttonScenePreview,
  EgOptionButton: buttonScenePreview,
  ShowcaseEgGlassPreview: ShowcaseEgGlassPreview as ComponentType<Record<string, unknown>>,
  ShowcaseGlassControlShellPreview: ShowcaseGlassControlShellPreview as ComponentType<
    Record<string, unknown>
  >,
  EgTabBar: ShowcaseTabBarPreview as ComponentType<Record<string, unknown>>,
  EgCregisTabBar: ShowcaseCregisTabBarPreview as ComponentType<Record<string, unknown>>,
  EgTabBarGlassBg: ShowcaseTabBarGlassBgPreview as ComponentType<Record<string, unknown>>,
  EgButtonGlass: ShowcaseGlassButtonPreview as ComponentType<Record<string, unknown>>,
  EgNavBar: ShowcaseNavBarPreview as ComponentType<Record<string, unknown>>,
  EgDivider: ShowcaseDividerPreview as ComponentType<Record<string, unknown>>,
  EgSymbol: ShowcaseSymbolPreview as ComponentType<Record<string, unknown>>,
  EgAvatar: ShowcaseAvatarPreview as ComponentType<Record<string, unknown>>,
  EgAvatarPreset0: ShowcaseAvatarPreset0Preview as ComponentType<Record<string, unknown>>,
  EgAvatarPreset1: ShowcaseAvatarPreset1Preview as ComponentType<Record<string, unknown>>,
};

export function resolveShowcasePreviewComponent(
  exportName: string,
): ComponentType<Record<string, unknown>> | null {
  const local = showcasePreviewByExport[exportName];
  if (local) {
    return local;
  }
  return resolvePreviewComponent(exportName);
}
