/** Tab stack index — 内容区大标题（底栏文案见 `showcaseNavTabs.label`）。 */
export const showcaseTabHomeTitles = {
  tokens: '设计令牌',
  animations: '动效',
  components: '组件',
  patterns: '数据与业务流',
  basics: '知识手册',
  workflows: '业务流',
} as const;

export type ShowcaseTabHomeTitleKey = keyof typeof showcaseTabHomeTitles;
