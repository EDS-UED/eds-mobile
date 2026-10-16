import { reportNativeEnhancementBypass } from '../../../shared/nativeEnhancementGuard.js';
import { isIos26OrLater } from '../../../shared/iosVersion.js';
import type { EgNavBarProps } from './EgNavBar.types.js';
import { EgNavBarRn } from './EgNavBarRn.js';

/** iOS 26+ → 系统导航栏（`egNavBarNativeStackOptions`）。 */
export function shouldUseEgNavBarNativeStack(): boolean {
  return isIos26OrLater();
}

/**
 * 顶部导航栏 — 状态栏区（safeArea.top）+ 导航内容区（padding + 左 / 标题 / 右 撑开）。
 *
 * - **iOS 26+**：强制系统 `UINavigationBar`，本组件不绘制 — 用 `egNavBarNativeStackOptions` /
 *   `egNavBarNativeStackScreenOptions`。
 * - **Android / iOS ≤25**：`EgNavBarRn` — `glass-mask-box` 背景贯穿状态栏，覆盖在内容之上
 *   （列表 `paddingTop` 用 `egNavBarScrollContentReserve`）。
 */
export function EgNavBar(props: EgNavBarProps) {
  if (shouldUseEgNavBarNativeStack() && !props.forceRnImplementation) {
    reportNativeEnhancementBypass('EgNavBar', 'egNavBarNativeStackOptions / egNavBarNativeStackScreenOptions');
    return null;
  }
  return <EgNavBarRn {...props} />;
}
