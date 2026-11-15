/** Scroll Edge 全屏演示 — Expo Router query ↔ 定制 state。 */

const DEMO_KEYS = [
  'mode',
  'container',
  'topEdgeStyle',
  'topEdgeHidden',
  'bottomEdgeStyle',
  'bottomEdgeHidden',
  'title',
  'showTitle',
  'showLeft',
  'showRight',
  'rightIconCount',
] as const;

function flag(value: unknown): string {
  return value === true || value === '1' || value === 'true' ? '1' : '0';
}

export function buildScrollEdgeDemoParams(state: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of DEMO_KEYS) {
    const value = state[key];
    if (value === undefined || value === null || value === '') continue;
    if (typeof value === 'boolean') {
      params[key] = flag(value);
    } else {
      params[key] = String(value);
    }
  }
  return params;
}

function readFlag(value: string | undefined, fallback: boolean): boolean {
  if (value === '1') return true;
  if (value === '0') return false;
  return fallback;
}

export function parseScrollEdgeDemoParams(
  params: Record<string, string | undefined>,
): Record<string, unknown> {
  return {
    glassType: 'scroll-edge-effect' as const,
    mode: params.mode === 'dark' ? 'dark' : 'light',
    container: params.container === 'sheet' ? 'sheet' : 'page',
    topEdgeStyle: params.topEdgeStyle ?? 'hard',
    topEdgeHidden: readFlag(params.topEdgeHidden, false),
    bottomEdgeStyle: params.bottomEdgeStyle ?? 'soft',
    bottomEdgeHidden: readFlag(params.bottomEdgeHidden, false),
    title: params.title ?? '标题',
    showTitle: readFlag(params.showTitle, true),
    showLeft: readFlag(params.showLeft, true),
    showRight: readFlag(params.showRight, true),
    rightIconCount: params.rightIconCount === '2' ? '2' : '1',
  };
}