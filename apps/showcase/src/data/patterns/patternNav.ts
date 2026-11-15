import {
  SHOWCASE_DATA_LIST_BODY_SLUG,
  SHOWCASE_ITEM_BODY_SLUG,
} from '@/data/components/showcaseInfraCatalog';

export type PatternEntry = {
  id: string;
  label: string;
  lead: string;
  packagePath: string;
  status: 'planned' | 'preview';
  /** Showcase 组件详情 slug — `status: preview` 时跳转。 */
  detailSlug?: string;
};

/** 数据 Tab — 页面级列表 / 字段模式（Eg* 场景真源在 components）。 */
export const patternEntries: PatternEntry[] = [
  {
    id: 'eg-data-list',
    label: 'EgDataList',
    lead: 'DL-bleed · EgDataListRow 行壳 · 点按缩放',
    packagePath: 'packages/components/src/organisms/data-list',
    status: 'preview',
    detailSlug: SHOWCASE_DATA_LIST_BODY_SLUG,
  },
  {
    id: 'eg-item',
    label: 'EgItem',
    lead: '个人中心设置行 · icon · 点按缩放 · module 分割线',
    packagePath: 'packages/components/src/organisms/item',
    status: 'preview',
    detailSlug: SHOWCASE_ITEM_BODY_SLUG,
  },
];