import type { CatalogSection } from '../types';

export type AnimationCatalogMeta = {
  slug: string;
  name: string;
  description: string;
  /** 什么场景下用 */
  whenToUse?: string;
  /** RN import 行 */
  rnImport?: string;
  /** RN 示例代码 */
  rnExample?: string;
  /** Showcase / Web 文档用 CSS class（RN 不用） */
  cssClass?: string;
  /** 禁止事项 */
  avoid?: string;
};

const guide: AnimationCatalogMeta[] = [
  {
    slug: 'motion-start',
    name: '快速开始',
    description: 'RN App 唯一入口：@eds/mobile-animations。禁止在业务代码硬编码 spring 参数。',
    whenToUse:
      'Token/CSS 同 Desktop：base 基数 → recipe 配方 → semantic 场景 class。RN App 用 @eds/mobile-animations。',
    rnImport: "import { mobileMotion, resolveMotionRecipe } from '@eds/mobile-animations';",
    rnExample: `import Animated, { withSpring } from 'react-native-reanimated';
import { mobileMotion } from '@eds/mobile-animations';

// 1. 最常用：直接拿 preset
scale.value = withSpring(0.96, mobileMotion.spring.press);

// 2. 需要 haptic / semantic 对照时用 recipe
const press = resolveMotionRecipe('press');
scale.value = withSpring(0.96, press.springConfig);
// press.hapticType → 映射 expo-haptics / 原生`,
    avoid: '禁止 { damping: 18, stiffness: 200 }；禁止复制 Figma 数值到 consumer。',
  },
];

const scenes: AnimationCatalogMeta[] = [
  {
    slug: 'scene-button-press',
    name: '按钮点按',
    description: 'Button / List Item / Icon 按下缩放反馈',
    whenToUse: 'Pressable / Touchable 的 onPressIn / onPressOut',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `pressed.value = withSpring(
  pressed ? 0.96 : 1,
  mobileMotion.spring.press,
);`,
    cssClass: 'motion-tap',
    avoid: '不要用 timing 做过渡；点按一律 spring.press',
  },
  {
    slug: 'scene-input-focus',
    name: '输入框聚焦',
    description: 'Input / Search 边框与 label 过渡',
    whenToUse: 'TextInput focus / blur',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `borderOpacity.value = withTiming(
  focused ? 1 : 0,
  mobileMotion.timing.easeIn,
);`,
    cssClass: 'motion-focus',
  },
  {
    slug: 'scene-tab-toggle',
    name: 'Tab / Toggle 形变',
    description: 'Tab 指示器滑动、Switch、Segmented 控件 morph',
    whenToUse: '选中态切换、thumb 位移',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `indicatorX.value = withSpring(targetX, mobileMotion.spring.control);`,
    cssClass: 'motion-deform',
  },
  {
    slug: 'scene-bottom-sheet',
    name: 'Bottom Sheet',
    description: '底部浮层呈现、拖拽、关闭',
    whenToUse: 'Sheet 组件、半屏弹层',
    rnImport: "import { mobileMotion, resolveMotionComposition } from '@eds/mobile-animations';",
    rnExample: `const sheet = resolveMotionComposition('ios-sheet');
// 呈现 → mobileMotion.spring.sheet
// 拖拽 → mobileMotion.spring.interactive
translateY.value = withSpring(0, mobileMotion.spring.sheet);`,
    cssClass: 'motion-flotation',
  },
  {
    slug: 'scene-stack-push',
    name: 'Stack 转场',
    description: 'Navigation Push / Pop / Interactive Pop',
    whenToUse: 'React Navigation stack、页面进出场',
    rnImport: "import { mobileMotion, resolveMotionComposition } from '@eds/mobile-animations';",
    rnExample: `const nav = resolveMotionComposition('ios-navigation');
// Push: spring.navigation + timing.navigationPush
// 手势返回: spring.interactive`,
    cssClass: 'motion-page',
  },
  {
    slug: 'scene-modal',
    name: 'Modal',
    description: '全屏/居中 Modal 内容与 backdrop',
    whenToUse: 'Alert、确认框、全屏 overlay',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `opacity.value = withSpring(1, mobileMotion.spring.modal);
scale.value = withSpring(1, mobileMotion.spring.modal);`,
    cssClass: 'motion-flotation',
  },
  {
    slug: 'scene-layout-morph',
    name: '容器尺寸 morph',
    description: 'Drawer 展开、Panel 高度变化、内容 crossfade',
    whenToUse: '大块布局动画（非页面转场）',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `height.value = withSpring(targetHeight, mobileMotion.spring.gentle);`,
    cssClass: 'motion-layout-deform',
  },
  {
    slug: 'scene-transaction',
    name: 'Crypto 交易状态',
    description: 'pending → confirming → confirmed 状态流转',
    whenToUse: '转账、签名、链上确认 UI',
    rnImport: "import { resolveMotionComposition, resolveMotionRecipe } from '@eds/mobile-animations';",
    rnExample: `const tx = resolveMotionComposition('transaction');
// 成功态
const ok = resolveMotionRecipe('success');
statusScale.value = withSpring(1, mobileMotion.spring.bouncy);`,
  },
  {
    slug: 'scene-reduce-motion',
    name: 'Reduce Motion',
    description: '系统「减少动态效果」降级策略',
    whenToUse: 'AccessibilityInfo.isReduceMotionEnabled() === true',
    rnImport: "import { AccessibilityInfo } from 'react-native';",
    rnExample: `const reduced = await AccessibilityInfo.isReduceMotionEnabled();
if (reduced) {
  opacity.value = withTiming(1, { duration: 180 });
  return;
}
translateY.value = withSpring(0, mobileMotion.spring.sheet);`,
    cssClass: 'motion-reduced-fade',
    avoid: '禁止 animation: none 一刀切；Slide 降级为 Fade',
  },
];

const reference: AnimationCatalogMeta[] = [
  {
    slug: 'ref-spring-presets',
    name: 'Spring 预设表',
    description: 'mobileMotion.spring.* — 仅在上面的场景没有覆盖时查阅',
    rnImport: "import { mobileMotion } from '@eds/mobile-animations';",
    rnExample: `mobileMotion.spring.interactive  // Interactive Pop / Sheet drag
mobileMotion.spring.press        // 点按
mobileMotion.spring.control      // Tab / Toggle
mobileMotion.spring.navigation   // Stack
mobileMotion.spring.sheet        // Bottom Sheet
mobileMotion.spring.modal        // Modal
mobileMotion.spring.gentle       // 大内容 morph
mobileMotion.spring.bouncy       // Success / Pull-to-refresh`,
  },
  {
    slug: 'ref-timing-presets',
    name: 'Timing 预设表',
    description: 'mobileMotion.timing.* — 非交互式过渡（主题切换、focus 边框等）',
    rnExample: `mobileMotion.timing.navigationPush  // Stack 曲线
mobileMotion.timing.easeInOut         // 主题 fade
mobileMotion.timing.easeIn            // 进场
mobileMotion.timing.easeOut           // 离场`,
  },
];

export const animationCatalogMeta: AnimationCatalogMeta[] = [
  ...guide,
  ...scenes,
  ...reference,
];

function toCatalogItems(entries: AnimationCatalogMeta[]) {
  return entries.map((entry) => ({
    name: entry.name,
    slug: entry.slug,
    description: entry.description,
    status: 'implemented' as const,
  }));
}

export const animationsCatalog: CatalogSection[] = [
  {
    title: '怎么用',
    items: toCatalogItems(guide),
  },
  {
    title: '场景',
    items: toCatalogItems(scenes),
  },
  {
    title: 'Preset 参考',
    items: toCatalogItems(reference),
  },
];

export const defaultAnimationSlug = guide[0].slug;

export function findAnimationMeta(slug: string): AnimationCatalogMeta | undefined {
  return animationCatalogMeta.find((entry) => entry.slug === slug);
}

export function isValidAnimationSlug(slug: string): boolean {
  return findAnimationMeta(slug) !== undefined;
}
