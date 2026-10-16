const reported = new Set<string>();

/** iOS 26+ 原生增强组件被当作 RN 视图渲染时 — 开发态报错并给出接入方式（组件不绘制）。 */
export function reportNativeEnhancementBypass(component: string, nativeEntry: string): void {
  if (typeof __DEV__ === 'undefined' || !__DEV__ || reported.has(component)) return;
  reported.add(component);
  console.error(
    `[EDS] ${component}：iOS 26+ 强制系统原生实现，RN 视图不绘制。请改用 ${nativeEntry}。`,
  );
}
