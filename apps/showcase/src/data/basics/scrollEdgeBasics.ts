import { SCROLL_EDGE_EFFECT_OPTIONS } from '@/data/components/sheetsCustomizeModel';

export type ScrollEdgeBasicsRow = {
  id: string;
  label: string;
  detail: string;
};

/** iOS 26+ 顶栏 scroll edge — 与 EgNavBar / EgSheets 定制选项对齐。 */
export const SCROLL_EDGE_EFFECT_ROWS: ScrollEdgeBasicsRow[] = [
  {
    id: 'follow',
    label: '跟随背景',
    detail: 'background auto — 静止 hidden · 内容滚入栏下 soft（iOS 26+ / 页面 EgNavBar 默认）',
  },
  ...SCROLL_EDGE_EFFECT_OPTIONS.map((option) => ({
    id: String(option.value),
    label: String(option.value),
    detail: option.label,
  })),
];

export const GLASS_MASK_BASICS_ROWS: ScrollEdgeBasicsRow[] = [
  {
    id: 'glass-mask-box',
    label: 'glass-mask-box',
    detail:
      'RN EgScrollEdgeEffect · 轻模糊 + 叠色 · 顶栏无朝内容侧虚化带 · 底栏 soft spacing-10 / hard spacing-3 虚化带 + 分割线',
  },
  {
    id: 'native-stack',
    label: 'iOS 26+ 页面栈',
    detail: '系统 UINavigationBar 自带 scroll edge（egNavBarNativeStackOptions）；其余 RN 栏',
  },
  {
    id: 'at-rest',
    label: '静止态',
    detail: '内容未滚入栏下时 scroll edge 为 hidden',
  },
];