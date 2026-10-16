import type { ComponentProps } from 'react';

import { ShowcaseTabBarPreview } from '@/views/components/glass/ShowcaseTabBarPreview';

/** EgCregisTabBar 详情 — 与 EgTabBar 同一预览壳（Cregis 四项）。 */
export function ShowcaseCregisTabBarPreview(props: ComponentProps<typeof ShowcaseTabBarPreview>) {
  return <ShowcaseTabBarPreview {...props} variant="cregis" />;
}
