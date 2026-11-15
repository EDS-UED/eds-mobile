/**
 * RN 栈（iOS ≤25 / Android）— 禁系统 `UINavigationBar`，仅浮层 `EgNavBar`。
 * Scroll edge 不显式传参，沿用 `EgNavBar` 缺省（静止 hidden · 滚入栏下 soft）。
 */
export const showcaseRnHiddenStackHeaderOptions = {
  headerShown: false,
  header: () => null,
} as const;
