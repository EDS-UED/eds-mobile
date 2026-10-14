import type mobileTheme from '@eds/mobile-tokens/theme';

/** Resolved semantic color map — same keys for light / dark (maps to dist color semantic.css). */
export type ShowcaseColorMap = (typeof mobileTheme.colors)['light'];

export type ShowcaseColorTheme = 'light' | 'dark';
