export type BasicsEntry = {
  id: string;
  label: string;
  lead: string;
  status: 'planned' | 'preview';
  /** Expo Router 路径 — `preview` 时可跳转。 */
  href?: `/(basics)/${string}`;
};

/** 基础 Tab — 工程文档式说明（手势 · 遮罩等；非 Figma 202 组件 Live）。 */
export const basicsEntries: BasicsEntry[] = [
  {
    id: 'gestures',
    label: '手势',
    lead: '基础交互手势',
    status: 'preview',
    href: '/(basics)/gestures',
  },
  {
    id: 'scroll-edge',
    label: '遮罩',
    lead: 'ScrollEdgeEffect、 EdsBlurGlass',
    status: 'preview',
    href: '/(basics)/scroll-edge',
  },
];