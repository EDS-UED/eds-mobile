/**
 * RN 栈（iOS ≤25 / Android）— 禁系统 `UINavigationBar`，仅浮层 `EgNavBar`。
 * Scroll edge 不显式传参，沿用 `EgNavBar` RN 缺省（页面滚入栏下 `soft`，与 iOS 26+ 系统栏一致）。
 */
export const showcaseRnHiddenStackHeaderOptions = {
  headerShown: false,
  header: () => null,
} as const;
