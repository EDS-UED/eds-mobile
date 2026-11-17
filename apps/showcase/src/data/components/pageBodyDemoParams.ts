import {
  pageBodyCustomizeDefaults,
  resolvePageBodyContentPaddingTop,
} from '@/data/components/pageBodyCustomizeModel';

const DEMO_KEYS = ['mode', 'contentPaddingTopPreset', 'contentPaddingTopCustom'] as const;

export function buildPageBodyDemoParams(state: Record<string, unknown>): Record<string, string> {
  const params: Record<string, string> = {};
  for (const key of DEMO_KEYS) {
    const value = state[key];
    if (value === undefined || value === null || value === '') continue;
    params[key] = String(value);
  }
  return params;
}

export function parsePageBodyDemoParams(
  params: Record<string, string | undefined>,
): Record<string, unknown> {
  const preset =
    params.contentPaddingTopPreset ?? pageBodyCustomizeDefaults.contentPaddingTopPreset;
  const custom =
    params.contentPaddingTopCustom != null
      ? Number(params.contentPaddingTopCustom)
      : pageBodyCustomizeDefaults.contentPaddingTopCustom;
  const merged = {
    ...pageBodyCustomizeDefaults,
    mode: params.mode === 'dark' ? 'dark' : 'light',
    contentPaddingTopPreset: preset,
    contentPaddingTopCustom: Number.isFinite(custom)
      ? custom
      : pageBodyCustomizeDefaults.contentPaddingTopCustom,
  };
  return {
    ...merged,
    contentPaddingTop: resolvePageBodyContentPaddingTop(merged),
  };
}