import { shouldUseEgNavBarNativeStack } from '@eds/mobile-components';

import { showcaseRnHiddenStackHeaderOptions } from '@/navigation/showcaseEgNavBarDefaults';

/**
 * 内层 Stack `Stack.Screen` — iOS 26+ 用系统栏（`title` 入栈 options）；
 * iOS ≤25 / Android 禁系统栏，避免与浮层 `EgNavBar` 叠栏。
 */
export function showcaseStackRouteOptions(title: string) {
  return shouldUseEgNavBarNativeStack() ? { title } : showcaseRnHiddenStackHeaderOptions;
}