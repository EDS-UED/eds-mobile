/**
 * RN 栈（iOS ≤25 / Android）— 禁系统 `UINavigationBar`，仅浮层 `EgNavBar`。
 * Scroll edge 不显式传参，沿用 `EgNavBar` RN 缺省（滚入栏下 `hard` · module 底线；iOS 26+ 系统栏仍为 soft）。
 */
export const showcaseRnHiddenStackHeaderOptions = {
  headerShown: false,
  header: () => null,
} as const;
