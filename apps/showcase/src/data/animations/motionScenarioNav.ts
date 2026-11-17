import type { MotionScenarioId } from '@/data/animations/motionScenarioCustomize';
import { formatEdsSemanticAnimaCall } from '@/data/tokens/motionNativeDisplay';

export type { MotionScenarioId };

export type MotionScenarioDemo = {
  id: MotionScenarioId;
  /** Motion 语义主入口 — 与 Tokens · Motion 列表一致：`EdsSemanticAnima('…')`。 */
  label: string;
  /** 中文场景说明 — 首页副标题。 */
  lead: string;
  /** 对应 Motion 语义令牌主入口 — RN 片段在 Tokens 页。 */
  primaryTokenName: string;
};

function motionScenarioDemo(
  id: MotionScenarioId,
  lead: string,
  primaryTokenName: string,
): MotionScenarioDemo {
  return {
    id,
    label: formatEdsSemanticAnimaCall(id),
    lead,
    primaryTokenName,
  };
}

export const motionScenarioDemos: MotionScenarioDemo[] = [
  motionScenarioDemo('press', '点按回弹', 'motion-press'),
  motionScenarioDemo('slide', '分段滑选', 'motion-slide'),
  motionScenarioDemo('layout-content', '正文切换', 'motion-layout-content'),
  motionScenarioDemo('fade', '淡入淡出', 'motion-fade'),
  motionScenarioDemo('menu', '浮层展开', 'motion-menu'),
  motionScenarioDemo('sheets', '底部浮层', 'motion-sheets'),
  motionScenarioDemo('page', '页面切换', 'motion-page'),
  motionScenarioDemo('page-shot', '弹层整页', 'motion-page-shot'),
];

export function findMotionScenarioDemo(id: string): MotionScenarioDemo | undefined {
  return motionScenarioDemos.find((item) => item.id === id);
}

const TOKEN_ALIASES: Record<string, string> = {
  press: 'motion-press',
  slide: 'motion-slide',
  'layout-content': 'motion-layout-content',
  fade: 'motion-fade',
  menu: 'motion-menu',
  'menu-dismiss': 'motion-menu',
  sheets: 'motion-sheets',
  'sheets-detent': 'motion-sheets',
  'sheets-dismiss': 'motion-sheets',
  page: 'motion-page',
  'page-back': 'motion-page',
  'page-shot': 'motion-page-shot',
  'page-shot-dismiss': 'motion-page-shot',
};

export function motionScenarioDemoForTokenName(tokenName: string): MotionScenarioDemo | undefined {
  const primary = TOKEN_ALIASES[tokenName] ?? tokenName;
  return motionScenarioDemos.find((item) => item.primaryTokenName === primary);
}

export function motionScenarioDemoForScenarioId(scenarioId: MotionScenarioId): MotionScenarioDemo | undefined {
  return motionScenarioDemos.find((item) => item.id === scenarioId);
}