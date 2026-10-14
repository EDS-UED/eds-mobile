/** EDSGlassView 顶层原则 — 与 `.cursor/rules/work.mdc` §6.0 同步；真机 demo 文案真源。 */

export const EDS_GLASS_TOP_LEVEL_PRINCIPLES = [
  'React Native 栈：只做 API、token 解析、材质/动效兜底；业务禁止 Platform 双组件。',
  'Token 真源：effect Glass Box + spec/liquid-glass/surface（mobileTheme.glass.surface）。',
  '引用液态/玻璃样式时：iOS 可在 EdsGlassView 内做原生材质增强；不可用则同一 token 外观，不得空白。',
  '动效：motion spec（glass-press / shimmer / morph）为兜底；iOS 可叠原生交互，语义仍走 recipe。',
] as const;

export const EDS_GLASS_MATERIAL_STACK_SUMMARY =
  '玻璃材质 = effect token + RN 默认（blur + overlay 叠层）+ 平台增强（Android: react-native-android-liquid-glass · iOS: expo-glass-effect）→ packages/components Glass 栈 · 业务只认 Eg* / GlassSurface';

/** 与 packages/tokens/spec/liquid-glass/system.json · dist/css/liquid-glass 同步 */
export const EDS_GLASS_RENDER_STACK = [
  'EgGlass → effect Glass Box + RN 叠层 + 平台增强',
  'Token: resolveGlassBoxComposition · resolveGlassVariant',
  'RN: GlassBoxEffectLayers · getNativeBlurView · overlay gradient stops',
  '平台: expo-glass-effect · react-native-android-liquid-glass · attachLiquidGlass',
  '→ GlassSurface / GlassControlShell（单一公共 API）',
] as const;

/** 对话梳理 · 待处理（非阻塞项按优先级自行排期） */
export const EDS_GLASS_OPEN_ISSUES = [
  'effect 层收敛单一语义档（如 effect-glass-liquid），替代分散 atomic + render 分叉叙事。',
  '样式名 → resolveGlassAppearance() 单链；iOS 增强由样式触发（非 consumer prop 堆砌）。',
  'Android blur 观感 / expo-blur 参数与 blur 采样区域调优。',
  'iOS 26+ 系统液态材质增强路径（自研 native，禁止第三方平行 export）。',
  '清理 RN 默认路径上的 Skia shader token 依赖叙事；Web liquid-glass.js 与 RN 边界写进 spec。',
  '真机 demo 控制同时 active blur 数量；列表/Tab 默认 frost preset。',
] as const;
