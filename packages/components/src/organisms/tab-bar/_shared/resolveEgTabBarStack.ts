import { isIos26OrLater } from '../../../shared/iosVersion.js';

/** iOS 26+ → 系统 Tab 条（`EgTabBarNativeLayout` · NativeTabs）。 */
export function shouldUseEgTabBarNativeStack(): boolean {
  return isIos26OrLater();
}
