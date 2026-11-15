import type { MotionScenarioId } from '@/data/animations/motionScenarioCustomize';

export type { MotionScenarioId };

export type MotionScenarioDemo = {
  id: MotionScenarioId;
  label: string;
  lead: string;
  /** 对应 Motion 语义令牌主入口 — RN 片段在 Tokens 页。 */
  primaryTokenName: string;
};

export const motionScenarioDemos: MotionScenarioDemo[] = [
  {
    id: 'press',
    label: 'Press',
    lead: 'EgEdsAnimaPress · 点按回弹',
    primaryTokenName: 'motion-press',
  },
  {
    id: 'slide',
    label: 'Slide',
    lead: 'EgEdsAnimaSlide · 分段滑选',
    primaryTokenName: 'motion-slide',
  },
  {
    id: 'layout-content',
    label: 'Layout content',
    lead: 'EgEdsAnimaLayoutContent · 正文切换',
    primaryTokenName: 'motion-layout-content',
  },
  {
    id: 'menu',
    label: 'Menu',
    lead: 'EgMenu · 浮层展开',
    primaryTokenName: 'motion-menu',
  },
  {
    id: 'sheets',
    label: 'Sheets',
    lead: 'EgSheets · 底部浮层',
    primaryTokenName: 'motion-sheets',
  },
  {
    id: 'page',
    label: 'Page',
    lead: 'EgEdsAnimaPage · 页面切换',
    primaryTokenName: 'motion-page',
  },
  {
    id: 'page-shot',
    label: 'Page shot',
    lead: 'EgEdsAnimaPageShot · 弹层整页',
    primaryTokenName: 'motion-page-shot',
  },
];

export function findMotionScenarioDemo(id: string): MotionScenarioDemo | undefined {
  return motionScenarioDemos.find((item) => item.id === id);
}

const TOKEN_ALIASES: Record<string, string> = {
  press: 'motion-press',
  slide: 'motion-slide',
  'layout-content': 'motion-layout-content',
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