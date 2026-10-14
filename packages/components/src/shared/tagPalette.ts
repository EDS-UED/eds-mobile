import { mobileTheme, type ThemeMode } from '../theme/index.js';
import type { ColorTagType } from './types.js';

export type TagStatus = 'danger' | 'warning' | 'success' | 'ready' | 'invalid';

export function resolveColorTagColors(type: ColorTagType, mode: ThemeMode, alt = false) {
  const entry = mobileTheme.tags.mobileColor[type][mode];
  if (!alt) return { bg: entry.bg, text: entry.text };
  return { bg: entry.altBg, text: entry.text };
}

export function resolveStatusTagColors(status: TagStatus, mode: ThemeMode) {
  const entry = mobileTheme.tags.mobileStatus[status][mode];
  return { bg: entry.bg, text: entry.text };
}
