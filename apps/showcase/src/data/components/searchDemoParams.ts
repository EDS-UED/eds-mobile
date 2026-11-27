import type { ThemeMode } from '@eds/mobile-components';

export type SearchDemoParams = {
  mode: ThemeMode;
  placeholder: string;
  disabled: boolean;
};

export function buildSearchDemoParams(state: Record<string, unknown>): Record<string, string> {
  const mode = state.mode === 'dark' ? 'dark' : 'light';
  const placeholder = typeof state.placeholder === 'string' ? state.placeholder : 'Search';
  const disabled = state.disabled === true;
  return {
    mode,
    placeholder,
    disabled: disabled ? '1' : '0',
  };
}

export function parseSearchDemoParams(
  params: Record<string, string | string[] | undefined>,
): SearchDemoParams {
  const mode = params.mode === 'dark' ? 'dark' : 'light';
  const placeholder =
    typeof params.placeholder === 'string' && params.placeholder.length > 0
      ? params.placeholder
      : 'Search';
  const disabled = params.disabled === '1' || params.disabled === 'true';
  return { mode, placeholder, disabled };
}