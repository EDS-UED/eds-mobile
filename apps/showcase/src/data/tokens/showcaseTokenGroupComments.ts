/**
 * Token group section titles — 中文（English）.
 * Same strings as spec / dist CSS comments; showcase reads these for Color semantic lists.
 */

export const SCALE_BASE_SHOWCASE = {
  primitive: '基数（Primitive）',
  engine: '原始尺度引擎（Primitive Scale Engine）',
} as const;

/** Color semantic — must match `COLOR_SEMANTIC_GROUP_ORDER` in packages/tokens/scripts/build.mjs */
export const COLOR_SEMANTIC_SHOWCASE_GROUPS = [
  { comment: '容器（Box）', prefix: 'box' },
  { comment: '线（Stroke）', prefix: 'stroke' },
  { comment: '文本（Text）', prefix: 'text' },
  { comment: '状态（Status）', prefix: 'status' },
  { comment: '特效（Effect）', prefix: 'effect' },
  { comment: '交互状态（Event）', prefix: 'event' },
] as const;

/** Animas / Motion — showcase 分组标题（spec 英文 comment → 中文）。 */
const MOTION_GROUP_COMMENT_ZH: Record<string, string> = {
  'Duration ladder（--motion-N · ms）': '时长阶梯 0–10',
  'Easing（--motion-ease-N）': '缓动 1–10',
  'Scale · Press': '缩放 · 点按',
  Haptic: '触觉反馈',
  'Interaction defaults': '交互默认',
  'Named Recipes': '命名配方',
  'Duration roles（→ motion-N）': '时长角色（→ motion-N）',
  'Easing roles': '缓动角色',
  'Property bundles': '属性组合',
  Recipes: '配方变量',
  Utilities: '工具类',
};

const MOTION_SPRING_ID_ZH: Record<string, string> = {
  press: '点按',
  'press-release': '松手回弹',
  control: '控件',
  'slide-commit': '滑选落位',
  drag: '跟手',
};

export function motionShowcaseGroupComment(specComment: string): string {
  const mapped = MOTION_GROUP_COMMENT_ZH[specComment];
  if (mapped) {
    return mapped;
  }
  const spring = /^Spring · (.+)$/.exec(specComment);
  if (spring?.[1]) {
    const id = spring[1];
    return `弹簧 · ${MOTION_SPRING_ID_ZH[id] ?? id}`;
  }
  return specComment;
}

export const MOTION_SHOWCASE_SECTION_TITLES = {
  base: 'Base',
  recipe: 'Recipe',
  semantic: 'Semantic',
} as const;
