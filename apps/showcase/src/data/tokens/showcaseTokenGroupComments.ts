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
