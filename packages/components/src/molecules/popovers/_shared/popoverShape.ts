export type PopoverPlacement = 'top' | 'bottom' | 'left' | 'right';
export type PopoverAlign = 'start' | 'center' | 'end';

/** 默认面板尺寸（336×adaptive + eds-popovers-triangle 37×11 箭头）。 */
export const POPOVER_PANEL_W = 336;
export const POPOVER_PANEL_H = 490;

/** Showcase 预置宽（fixed widthMode）：256 引导 / 336 基础 / 460 复杂。 */
export const POPOVER_PRESET_WIDTH_GUIDE = 256;
export const POPOVER_PRESET_WIDTH_BASE = 336;
/** 二次确认 Popover 面板宽（px）。 */
export const POPOVER_PRESET_WIDTH_CONFIRM = 296;
export const POPOVER_PRESET_WIDTH_COMPLEX = 460;

/** 批处理 / 审批 Remark Popover 备注最大字数。 */
export const REMARK_POPOVER_MAX_LENGTH = 256;

/** adaptive / SVG 面板区最小尺寸（不含箭头；fixed 默认宽见 POPOVER_PANEL_W）。 */
export const POPOVER_PANEL_MIN_W = 168;
export const POPOVER_PANEL_MIN_H = 88;

/** compact：单行短文案（如定位气泡）；adaptive 随内容收缩。 */
export const POPOVER_PANEL_COMPACT_MIN_W = 32;
export const POPOVER_PANEL_COMPACT_MIN_H = 32;

export type PopoverSize = 'default' | 'compact';

export type PopoverPanelMins = {
  panelMinW: number;
  panelMinH: number;
};

export const DEFAULT_POPOVER_PANEL_MINS: PopoverPanelMins = {
  panelMinW: POPOVER_PANEL_MIN_W,
  panelMinH: POPOVER_PANEL_MIN_H,
};

export const COMPACT_POPOVER_PANEL_MINS: PopoverPanelMins = {
  panelMinW: POPOVER_PANEL_COMPACT_MIN_W,
  panelMinH: POPOVER_PANEL_COMPACT_MIN_H,
};

export function resolvePopoverPanelMins(size: PopoverSize = 'default'): PopoverPanelMins {
  return size === 'compact' ? COMPACT_POPOVER_PANEL_MINS : DEFAULT_POPOVER_PANEL_MINS;
}

/** eds-popovers-triangle.svg viewBox 尺寸（1:1，无缩放）。 */
export const POPOVER_ARROW_W = 37;
export const POPOVER_ARROW_H = 11;
export const POPOVER_RADIUS = 12;

/** align start/end 时箭头距面板交叉轴边缘（≈9/26×37）。 */
const ARROW_INSET = 13;

export type PopoverPanelDimensions = {
  panelW: number;
  panelH: number;
};

export type PopoverContentInset = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};

export type PopoverShellMetrics = {
  width: number;
  height: number;
  viewBox: string;
  contentInset: PopoverContentInset;
};

export const DEFAULT_POPOVER_PANEL: PopoverPanelDimensions = {
  panelW: POPOVER_PANEL_W,
  panelH: POPOVER_PANEL_H,
};

const fmt = (x: number, y: number) => `${x} ${y}`;

type PtFn = (x: number, y: number) => string;

function resolvePanelDimensions(
  dimensions?: Partial<PopoverPanelDimensions>,
  mins: PopoverPanelMins = DEFAULT_POPOVER_PANEL_MINS,
): PopoverPanelDimensions {
  return {
    panelW: Math.max(dimensions?.panelW ?? POPOVER_PANEL_W, mins.panelMinW),
    panelH: Math.max(dimensions?.panelH ?? POPOVER_PANEL_H, mins.panelMinH),
  };
}

/**
 * 箭头曲线（开放路径）：从 (0,11) 经尖端至 (37,11)，不描底边直线。
 * 底边由面板轮廓 H 线段承担，避免 shapeStroke 在接缝处出现横线。
 */
function arrowUpCurveOpen(pt: PtFn): string {
  return [
    `C ${pt(5, 11)} ${pt(8.75, 8)} ${pt(10, 7)}`,
    `C ${pt(11.25, 6)} ${pt(12.627976, 4.676649)} ${pt(15.8125, 1.170635)}`,
    `L ${pt(15.8125, 1.132037)}`,
    `C ${pt(16.482387, 0.407249)} ${pt(17.391396, 0)} ${pt(18.339286, 0)}`,
    `C ${pt(19.287176, 0)} ${pt(20.196185, 0.407249)} ${pt(20.866071, 1.132037)}`,
    `C ${pt(24.122024, 4.377346)} ${pt(26.166667, 6.333333)} ${pt(27, 7)}`,
    `C ${pt(28.25, 8)} ${pt(32, 11)} ${pt(37, 11)}`,
  ].join(' ');
}

/** 开放路径反向：(37,11) → 尖端 → (0,11)。 */
function arrowUpCurveOpenReverse(pt: PtFn): string {
  return [
    `C ${pt(32, 11)} ${pt(28.25, 8)} ${pt(27, 7)}`,
    `C ${pt(26.166667, 6.333333)} ${pt(24.122024, 4.377346)} ${pt(20.866071, 1.132037)}`,
    `C ${pt(20.196185, 0.407249)} ${pt(19.287176, 0)} ${pt(18.339286, 0)}`,
    `C ${pt(17.391396, 0)} ${pt(16.482387, 0.407249)} ${pt(15.8125, 1.132037)}`,
    `L ${pt(15.8125, 1.170635)}`,
    `C ${pt(12.627976, 4.676649)} ${pt(11.25, 6)} ${pt(10, 7)}`,
    `C ${pt(8.75, 8)} ${pt(5, 11)} ${pt(0, 11)}`,
  ].join(' ');
}

function mirrorArrowY(y: number): number {
  return POPOVER_ARROW_H - y;
}

/** 沿 arrowUp 开放路径 Y 镜像（尖端朝下）：(0,0) → 尖端 → (37,0)。 */
function arrowDownCurveOpen(pt: PtFn): string {
  const m = (x: number, y: number) => pt(x, mirrorArrowY(y));
  return [
    `C ${m(5, 11)} ${m(8.75, 8)} ${m(10, 7)}`,
    `C ${m(11.25, 6)} ${m(12.627976, 4.676649)} ${m(15.8125, 1.170635)}`,
    `L ${m(15.8125, 1.132037)}`,
    `C ${m(16.482387, 0.407249)} ${m(17.391396, 0)} ${m(18.339286, 0)}`,
    `C ${m(19.287176, 0)} ${m(20.196185, 0.407249)} ${m(20.866071, 1.132037)}`,
    `C ${m(24.122024, 4.377346)} ${m(26.166667, 6.333333)} ${m(27, 7)}`,
    `C ${m(28.25, 8)} ${m(32, 11)} ${m(37, 11)}`,
  ].join(' ');
}

/** 开放路径反向：(37,0) → 尖端 → (0,0)（Y 镜像后用于 top 底边）。 */
function arrowDownCurveOpenReverse(pt: PtFn): string {
  const m = (x: number, y: number) => pt(x, mirrorArrowY(y));
  return [
    `C ${m(32, 11)} ${m(28.25, 8)} ${m(27, 7)}`,
    `C ${m(26.166667, 6.333333)} ${m(24.122024, 4.377346)} ${m(20.866071, 1.132037)}`,
    `C ${m(20.196185, 0.407249)} ${m(19.287176, 0)} ${m(18.339286, 0)}`,
    `C ${m(17.391396, 0)} ${m(16.482387, 0.407249)} ${m(15.8125, 1.132037)}`,
    `L ${m(15.8125, 1.170635)}`,
    `C ${m(12.627976, 4.676649)} ${m(11.25, 6)} ${m(10, 7)}`,
    `C ${m(8.75, 8)} ${m(5, 11)} ${m(0, 11)}`,
  ].join(' ');
}

/**
 * placement bottom：箭头在顶边，尖端朝上。
 * 当前点须在箭头左底角 (tx, baseY)；结束于右底角 (tx+37, baseY)。
 */
function arrowContourUp(tx: number, baseY: number): string {
  const pt: PtFn = (x, y) => fmt(tx + x, baseY - POPOVER_ARROW_H + y);
  return arrowUpCurveOpen(pt);
}

/** placement top：当前点在箭头右底角 (tx+37, baseY)，经尖端回到左底角。 */
function arrowContourDownReverse(tx: number, baseY: number): string {
  const pt: PtFn = (x, y) => fmt(tx + x, baseY + y);
  return arrowDownCurveOpenReverse(pt);
}

/** placement left：当前点在箭头顶部 (baseX, ty)；结束于 (baseX, ty+37)。 */
function arrowContourRight(baseX: number, ty: number): string {
  const pt: PtFn = (x, y) => fmt(baseX + POPOVER_ARROW_H - y, ty + x);
  return arrowUpCurveOpen(pt);
}

/** placement right：当前点在箭头底部 (baseX, ty+37)，经尖端回到顶部。 */
function arrowContourLeftReverse(baseX: number, ty: number): string {
  const pt: PtFn = (x, y) => fmt(baseX + y - POPOVER_ARROW_H, ty + x);
  return arrowUpCurveOpenReverse(pt);
}

function resolveArrowMainOffset(
  align: PopoverAlign,
  span: number,
  arrowSpan: number,
): number {
  if (align === 'start') return ARROW_INSET;
  if (align === 'end') return span - ARROW_INSET - arrowSpan;
  return (span - arrowSpan) / 2;
}

/** placement bottom：箭头在顶边，尖端朝上。 */
function buildBottomOutline(
  align: PopoverAlign,
  { panelW, panelH }: PopoverPanelDimensions,
  cornerRadius: number,
): string {
  const w = panelW;
  const h = panelH;
  const r = cornerRadius;
  const panelTop = POPOVER_ARROW_H;
  const arrowX = resolveArrowMainOffset(align, w, POPOVER_ARROW_W);

  return [
    `M ${fmt(r, panelTop)}`,
    `H ${arrowX}`,
    arrowContourUp(arrowX, panelTop),
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(w, panelTop + r)}`,
    `V ${panelTop + h - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(w - r, panelTop + h)}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(0, panelTop + h - r)}`,
    `V ${panelTop + r}`,
    `A ${r} ${r} 0 0 1 ${fmt(r, panelTop)}`,
    'Z',
  ].join(' ');
}

/** placement top：箭头在底边，尖端朝下。 */
function buildTopOutline(
  align: PopoverAlign,
  { panelW, panelH }: PopoverPanelDimensions,
  cornerRadius: number,
): string {
  const w = panelW;
  const h = panelH;
  const r = cornerRadius;
  const arrowX = resolveArrowMainOffset(align, w, POPOVER_ARROW_W);

  return [
    `M ${fmt(r, 0)}`,
    `H ${w - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(w, r)}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(w - r, h)}`,
    `H ${arrowX + POPOVER_ARROW_W}`,
    arrowContourDownReverse(arrowX, h),
    `H ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(0, h - r)}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(r, 0)}`,
    'Z',
  ].join(' ');
}

/** placement left：箭头在右边，尖端朝右。 */
function buildLeftOutline(
  align: PopoverAlign,
  { panelW, panelH }: PopoverPanelDimensions,
  cornerRadius: number,
): string {
  const w = panelW;
  const h = panelH;
  const r = cornerRadius;
  const panelRight = w;
  const arrowY = resolveArrowMainOffset(align, h, POPOVER_ARROW_W);

  return [
    `M ${fmt(r, 0)}`,
    `H ${panelRight - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelRight, r)}`,
    `V ${arrowY}`,
    arrowContourRight(panelRight, arrowY),
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelRight - r, h)}`,
    `H ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(0, h - r)}`,
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(r, 0)}`,
    'Z',
  ].join(' ');
}

/** placement right：箭头在左边，尖端朝左。 */
function buildRightOutline(
  align: PopoverAlign,
  { panelW, panelH }: PopoverPanelDimensions,
  cornerRadius: number,
): string {
  const w = panelW;
  const h = panelH;
  const r = cornerRadius;
  const panelLeft = POPOVER_ARROW_H;
  const arrowY = resolveArrowMainOffset(align, h, POPOVER_ARROW_W);

  return [
    `M ${fmt(panelLeft + r, 0)}`,
    `H ${panelLeft + w - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelLeft + w, r)}`,
    `V ${h - r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelLeft + w - r, h)}`,
    `H ${panelLeft + r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelLeft, h - r)}`,
    `V ${arrowY + POPOVER_ARROW_W}`,
    arrowContourLeftReverse(panelLeft, arrowY),
    `V ${r}`,
    `A ${r} ${r} 0 0 1 ${fmt(panelLeft + r, 0)}`,
    'Z',
  ].join(' ');
}

export function buildPopoverOutlinePath(
  placement: PopoverPlacement,
  align: PopoverAlign,
  dimensions?: Partial<PopoverPanelDimensions>,
  mins: PopoverPanelMins = DEFAULT_POPOVER_PANEL_MINS,
  cornerRadius: number = POPOVER_RADIUS,
): string {
  const size = resolvePanelDimensions(dimensions, mins);
  const r = Math.min(
    cornerRadius,
    size.panelW / 2,
    size.panelH / 2,
    POPOVER_ARROW_W / 2,
  );
  switch (placement) {
    case 'bottom':
      return buildBottomOutline(align, size, r);
    case 'top':
      return buildTopOutline(align, size, r);
    case 'left':
      return buildLeftOutline(align, size, r);
    case 'right':
      return buildRightOutline(align, size, r);
    default:
      return buildBottomOutline(align, size, r);
  }
}

export function getPopoverShellMetrics(
  placement: PopoverPlacement,
  dimensions?: Partial<PopoverPanelDimensions>,
  mins: PopoverPanelMins = DEFAULT_POPOVER_PANEL_MINS,
): PopoverShellMetrics {
  const { panelW, panelH } = resolvePanelDimensions(dimensions, mins);
  switch (placement) {
    case 'bottom':
      return {
        width: panelW,
        height: panelH + POPOVER_ARROW_H,
        viewBox: `0 0 ${panelW} ${panelH + POPOVER_ARROW_H}`,
        contentInset: {
          top: POPOVER_ARROW_H,
          right: 0,
          bottom: 0,
          left: 0,
        },
      };
    case 'top':
      return {
        width: panelW,
        height: panelH + POPOVER_ARROW_H,
        viewBox: `0 0 ${panelW} ${panelH + POPOVER_ARROW_H}`,
        contentInset: {
          top: 0,
          right: 0,
          bottom: POPOVER_ARROW_H,
          left: 0,
        },
      };
    case 'left':
      return {
        width: panelW + POPOVER_ARROW_H,
        height: panelH,
        viewBox: `0 0 ${panelW + POPOVER_ARROW_H} ${panelH}`,
        contentInset: {
          top: 0,
          right: POPOVER_ARROW_H,
          bottom: 0,
          left: 0,
        },
      };
    case 'right':
      return {
        width: panelW + POPOVER_ARROW_H,
        height: panelH,
        viewBox: `0 0 ${panelW + POPOVER_ARROW_H} ${panelH}`,
        contentInset: {
          top: 0,
          right: 0,
          bottom: 0,
          left: POPOVER_ARROW_H,
        },
      };
    default:
      return getPopoverShellMetrics('bottom', dimensions);
  }
}
