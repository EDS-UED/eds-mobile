import type { ShowcaseComponentAnnotationDoc } from './componentAnnotationTypes';

/** 按 slug 覆盖 — 优先于族模板；每行一条，展示层加项目符。 */
export const componentAnnotationBySlug: Record<string, ShowcaseComponentAnnotationDoc> = {
  'page-body': {
    sections: [
      {
        title: '样式',
        lines: [
          '滚动区背景 `box-page`',
          'Showcase / 业务页底 `box-page-card`',
          '与页底同色时卡片用 `material-card-shallow`',
        ],
      },
      {
        title: '布局',
        lines: [
          '左右默认 `spacing-5`（20px）',
          '底默认 `spacing-10`（40px）',
          '顶边距 `contentPaddingTop`（Customize 档位 xs–2xl）',
          '`contentContainerStyle` 可覆盖，后写优先',
        ],
      },
      {
        title: '动效',
        lines: [
          '`EdsSemanticAnima(\'page\')`',
          '返回 `page-back`',
          '配合 `createEgPageNavigator` + `egPageScreenOptions`',
        ],
      },
      {
        title: '多系统差异',
        lines: [
          'iOS 26+ 系统 `UINavigationBar` + 系统转场',
          '`contentInsetAdjustmentBehavior="automatic"`',
          'Scroll edge 静止 `hidden` · 滚入 `soft`（`useEgNavBarScroll`）',
          'Android · iOS ≤25：RN `EgNavBar` + page spring',
          '顶栏占位 `egNavBarScrollContentReserve`',
        ],
      },
      {
        title: '其他',
        lines: ['详情「预览」→ 全屏边距 + motion-page', 'USAGE / PROPS 见页脚'],
      },
    ],
  },
  'page-shot-body': {
    sections: [
      {
        title: '样式',
        lines: ['弹层内页色票同 EgPage', '触发元素圆角由业务 `radius` 传入'],
      },
      {
        title: '布局',
        lines: ['`EgPageShot` 全屏宿主', '内页仍 EgPage 边距契约', '`renderRoot` / `renderPage` API'],
      },
      {
        title: '动效',
        lines: ['`EdsSemanticAnima(\'page-shot\')` 展开 / 收回', '内可嵌套 motion-page'],
      },
      {
        title: '多系统差异',
        lines: [
          'iOS 26+ `ScreenStack` + 系统栏 glass 钮',
          'Android · iOS ≤25：RN Modal + EgNavBar',
        ],
      },
      {
        title: '其他',
        lines: ['`EgPageShotTrigger` 与源卡片 frame 对齐'],
      },
    ],
  },
  'glass-scroll-edge': {
    sections: [
      {
        title: '样式',
        lines: ['材质 `glass-mask-box`', '强度来自 effect token', '页面 soft / Sheet hard 语义'],
      },
      {
        title: '布局',
        lines: ['顶 / 底 / 侧单边层', '高度随 NavBar / Sheet 顶栏占位'],
      },
      {
        title: '动效',
        lines: ['随滚动显现', '无独立 press recipe'],
      },
      {
        title: '多系统差异',
        lines: [
          'RN `EgScrollEdgeEffect` 双端一致',
          'iOS 26+ 可叠系统 `scrollEdgeEffects`',
          'Android 深遮罩 blur',
        ],
      },
      {
        title: '其他',
        lines: ['「全屏演示」→ scroll-edge-demo'],
      },
    ],
  },
  'button-glass': {
    sections: [
      {
        title: '样式',
        lines: [
          '液态玻璃 preset',
          '文案 `typography-body-medium`',
          '高光 / 描边 `liquid-glass/surface`',
        ],
      },
      {
        title: '布局',
        lines: ['高度 `button-*` 档位', 'iOS 26+ 勿在 `GlassView` 外叠 padding'],
      },
      {
        title: '动效',
        lines: [
          '`EdsSemanticAnima(\'press\')`',
          'recipe `glass-press` / `glass-shimmer`',
        ],
      },
      {
        title: '多系统差异',
        lines: ['iOS 26+ 原生 `GlassView`', 'Android · ≤25 RN blur + token'],
      },
      {
        title: '其他',
        lines: ['业务只引 `EgButtonGlass`'],
      },
    ],
  },
};