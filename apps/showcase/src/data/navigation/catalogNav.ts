/** Showcase IA — bottom tabs mirror eds-desktop sidebar sections. */
export const showcaseTabNav = [
  { id: 'tokens', label: '令牌' },
  { id: 'animations', label: '动画' },
  { id: 'components', label: '组件' },
  { id: 'patterns', label: '数据' },
  { id: 'basics', label: '基础' },
] as const;

export type ShowcaseTabId = (typeof showcaseTabNav)[number]['id'];
