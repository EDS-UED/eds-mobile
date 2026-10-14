import { isIos26OrLater } from './iosVersion.js';

/** iOS 26+ → Expo NativeTabs 原生 Tab 条；否则 RN `EgTabBar` + `EgGlass`。 */
export function shouldUseEgTabBarNativeStack(): boolean {
  return isIos26OrLater();
}
