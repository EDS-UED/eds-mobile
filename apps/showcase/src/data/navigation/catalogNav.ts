/** Showcase IA — bottom tabs mirror eds-desktop sidebar sections. */
export const showcaseTabNav = [
  { id: 'tokens', label: '设计令牌' },
  { id: 'animations', label: '动效' },
  { id: 'components', label: '组件' },
  { id: 'patterns', label: '数据与业务流' },
  { id: 'basics', label: '知识手册' },
] as const;

export type ShowcaseTabId = (typeof showcaseTabNav)[number]['id'];
