import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

/** 浮层倒出 · EdsSemanticAnima('menu') → spring.menu-in。 */
export const menuInSpringConfig = cloneSpringConfig(EdsSemanticAnima('menu').springConfig);

/** 浮层收回 · EdsRecipeAnima('menu-dismiss') → spring.menu-out。 */
export const menuOutSpringConfig = cloneSpringConfig(EdsRecipeAnima('menu-dismiss').springConfig);

/** Base `motion-scale-menu-origin`。 */
export const menuOriginScale = mobileTheme.motion.scale['scale-menu-origin'] ?? 0.2;

/** Base `motion-scale-menu-trigger-lift`。 */
export const menuTriggerLift = mobileTheme.motion.scale['scale-menu-trigger-lift'] ?? 1.15;
/** 触发器与水滴在 progress 这段内交叉融合：展开时触发器鼓起淡出、水滴淡入；收回逆序。 */
const MENU_HANDOFF = 0.22;
/** 内容自该 progress 起显出，到 `MENU_CONTENT_END` 完全清晰。 */
const MENU_CONTENT_START = 0.45;
const MENU_CONTENT_END = 0.85;
/**
 * scaleY 相对 scaleX 的领先量（竖长水滴，仅展开）：`p + k·p·(1−p)²`。
 * 在 p = 1 处值为 1、斜率为 1，spring 过冲越过 1 时无折点；k ≤ 3 保持单调。
 */
const MENU_VERTICAL_LEAD = 1.5;
/** 收回：外壳保持实体直到缩近触发器，在 `MENU_CLOSE_HANDOFF` → `MENU_CLOSE_FADE_START` 与触发器交叉融合。 */
const MENU_CLOSE_FADE_START = 0.04;
/** 收回：触发器在 progress 这段内淡入并鼓起，接住缩回的水滴。 */
const MENU_CLOSE_HANDOFF = 0.3;
/** 收回：内容随外壳一起缩，在该窗口内隐去。 */
const MENU_CLOSE_CONTENT_START = 0.38;
const MENU_CLOSE_CONTENT_END = 0.78;
function clamp01(value: number) {
  'worklet';
  return Math.min(1, Math.max(0, value));
}

/** 分段窗口用 smoothstep，避免线性分段在端点处速度突变（读作硬切）。 */
function smooth01(value: number) {
  'worklet';
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
}

/** 阴影层（圆角固定、不随形变重绘）在外形接近到位后才显出；收回时最先退场。 */
const MENU_SHADOW_START = 0.55;
const MENU_CLOSE_SHADOW_END = 0.65;

/**
 * 浮层容器 · `useAnimatedStyle` 内调用。
 * 展开不位移，回弹来自 spring 过冲（progress > 1 时 scale 略超 1）。
 * `closing`：收回段 — 朝触发器等比缩放收起，缩近后与触发器交叉融合。
 */
export function menuContainerStyle(
  progress: number,
  reduceMotion: boolean,
  originScale: number,
  closing: boolean,
) {
  'worklet';
  if (reduceMotion) {
    return {
      opacity: clamp01(progress),
      transform: [] as { scaleX?: number; scaleY?: number; translateY?: number }[],
    };
  }
  if (closing) {
    const p = clamp01(progress);
    const scale = originScale + (1 - originScale) * p;
    return {
      opacity: smooth01(
        (p - MENU_CLOSE_FADE_START) / (MENU_CLOSE_HANDOFF - MENU_CLOSE_FADE_START),
      ),
      transform: [{ translateY: 0 }, { scaleX: scale }, { scaleY: scale }],
    };
  }
  const rest = 1 - progress;
  const lead = progress + MENU_VERTICAL_LEAD * progress * rest * rest;
  return {
    opacity: smooth01(progress / MENU_HANDOFF),
    transform: [
      { translateY: 0 },
      { scaleX: originScale + (1 - originScale) * progress },
      { scaleY: originScale + (1 - originScale) * lead },
    ],
  };
}

/** 外壳圆角：起步全圆（水滴）→ 面板 radius。 */
export function menuShellRadius(progress: number, roundRadius: number, panelRadius: number) {
  'worklet';
  const t = smooth01(progress / MENU_CONTENT_END);
  return roundRadius + (panelRadius - roundRadius) * t;
}

/** 阴影层透明度。 */
export function menuShadowOpacity(progress: number, reduceMotion: boolean, closing: boolean) {
  'worklet';
  if (reduceMotion) {
    return clamp01(progress);
  }
  if (closing) {
    return smooth01((progress - MENU_CLOSE_SHADOW_END) / (1 - MENU_CLOSE_SHADOW_END));
  }
  return smooth01((progress - MENU_SHADOW_START) / (1 - MENU_SHADOW_START));
}

/** 内容层：外形接近到位时才显出。 */
export function menuContentOpacity(progress: number, reduceMotion: boolean, closing: boolean) {
  'worklet';
  if (reduceMotion) {
    return 1;
  }
  if (closing) {
    return smooth01(
      (progress - MENU_CLOSE_CONTENT_START) / (MENU_CLOSE_CONTENT_END - MENU_CLOSE_CONTENT_START),
    );
  }
  return smooth01((progress - MENU_CONTENT_START) / (MENU_CONTENT_END - MENU_CONTENT_START));
}

/** 触发器交接：展开时鼓起后隐去；收回时重新出现并鼓起回弹。 */
export function menuTriggerStyle(
  progress: number,
  reduceMotion: boolean,
  lift: number,
  closing: boolean,
) {
  'worklet';
  if (reduceMotion) {
    return { opacity: 1, transform: [{ scale: 1 }] };
  }
  const local = clamp01(progress / (closing ? MENU_CLOSE_HANDOFF : MENU_HANDOFF));
  return {
    opacity: 1 - smooth01(local),
    transform: [{ scale: 1 + (lift - 1) * Math.sin(Math.PI * local) }],
  };
}
