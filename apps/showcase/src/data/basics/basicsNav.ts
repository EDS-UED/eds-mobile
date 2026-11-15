export type BasicsEntry = {
  id: string;
  label: string;
  lead: string;
  status: 'planned' | 'preview';
  /** Expo Router 路径 — `preview` 时可跳转。 */
  href?: `/(basics)/${string}`;
};

/** 基础 Tab — EDS 工程能力 / 联调 / 几何对照（非 Figma 202 组件项）。 */
export const basicsEntries: BasicsEntry[] = [
  {
    id: 'parity',
    label: 'Layout parity',
    lead: 'RN 与 token 几何对照探针',
    status: 'preview',
    href: '/(basics)/parity',
  },
  {
    id: 'gestures',
    label: '手势',
    lead: 'Mobile 基础交互手势',
    status: 'preview',
    href: '/(basics)/gestures',
  },
  {
    id: 'scroll-edge',
    label: '遮罩',
    lead: 'Scroll Edge Effect · glass-mask-box',
    status: 'preview',
    href: '/(basics)/scroll-edge',
  },
];