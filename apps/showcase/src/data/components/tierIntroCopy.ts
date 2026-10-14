import type { FigmaComponentEntry } from '@eds/mobile-components/catalog';

/** Tier 页副文案 — showcase 内页说明，非 Figma spec。 */
export const TIER_INTRO_COPY: Record<FigmaComponentEntry['tier'], string> = {
  atoms: '最小 UI 单元与基础设施：文字、图标、Glass 玻璃栈等，分子/有机体从这里组合。',
  molecules: '常用交互控件：按钮、输入、标签、切换等，由原子拼装而成。',
  organisms: '页面级组合件：底栏、浮层、下拉菜单等更完整的界面结构。',
  templates: '页面骨架与布局模板，用来承载完整业务场景。',
};

/** Tier 内页大标题下副文本 — 首页 Tier 卡片 hint 须与此一致。 */
export function tierPageSubtitle(tier: FigmaComponentEntry['tier']): string {
  const copy = TIER_INTRO_COPY[tier];
  const head = copy.split('：')[0]?.trim();
  return head && head.length > 0 ? head : copy;
}
