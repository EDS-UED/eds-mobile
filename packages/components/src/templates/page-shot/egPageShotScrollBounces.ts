/**
 * 停顶橡皮筋区 · `contentOffset.y` 低于此值时关整轴顶向 `bounces`。
 * **≠** 下拉关页阈值（见 `EG_PAGE_SHOT_DISMISS_TOP_Y`）。
 */
export const EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y = 120;

/** 轻扫下拉关页 · 须真正滚到顶（与 `useEgNavBarScroll` 停顶 1px 同轨）。 */
export const EG_PAGE_SHOT_DISMISS_TOP_Y = 1;

/**
 * page-shot · 有下拉桥时的垂直橡皮筋。
 *
 * iOS / RN **没有**「只开底部、只关顶部」的独立属性，`bounces` 为整轴开关。
 * 可行策略：停顶区（≤ `EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y`）关弹；内容可滚且离顶后开弹 → **到底可底弹**。
 * 离顶后在列表中段 `bounces` 仍为 true 时，系统仍可能在极高偏移下出现轻微顶过拉，属平台限制。
 */
export function resolveEgPageShotVerticalBounce(
  scrollBounces: boolean,
  offsetY: number,
  contentHeight: number,
  layoutHeight: number,
): boolean {
  'worklet';
  if (!scrollBounces) return false;
  const maxOffset = Math.max(0, contentHeight - layoutHeight);
  if (maxOffset <= 0) return false;
  if (offsetY <= EG_PAGE_SHOT_SCROLL_LEAVE_TOP_Y) return false;
  return true;
}

/** page-shot（无下拉桥）· 停顶关顶橡皮筋。 */
export function resolveEgPageShotScrollBounces(
  scrollBounces: boolean,
  scrollAtTop: boolean,
  hasPullDismiss: boolean,
): boolean {
  if (!hasPullDismiss) return scrollBounces;
  if (scrollAtTop) return false;
  return scrollBounces;
}