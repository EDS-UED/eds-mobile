/**
 * RN 栈（iOS ≤25 / Android）— 禁系统 `UINavigationBar`，仅浮层 `EgNavBar`。
 * Scroll edge 不显式传参，沿用 `EgNavBar` RN 缺省（`hard` · 滚入栏下带 module 底线）。
 */
export const showcaseRnHiddenStackHeaderOptions = {
  headerShown: false,
  header: () => null,
} as const;
