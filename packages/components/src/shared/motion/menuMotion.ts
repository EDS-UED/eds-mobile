import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';
import { Easing } from 'react-native-reanimated';

import { mobileTheme } from '../../theme/index.js';
import { cloneSpringConfig } from '../slideMotion.js';

/** 浮层倒出 · EdsSemanticAnima('menu') → spring.menu-in。 */
export const menuInSpringConfig = cloneSpringConfig(EdsSemanticAnima('menu').springConfig);

/** 浮层收回 · EdsRecipeAnima('menu-dismiss') → spring.menu-out。 */
export const menuOutSpringConfig = cloneSpringConfig(EdsRecipeAnima('menu-dismiss').springConfig);

/** 按住拖拽松手 · spring.menu-stretch-release（欠阻尼果冻回弹）。 */
export const menuStretchReleaseSpringConfig = cloneSpringConfig(
  mobileTheme.motion.springByName['menu-stretch-release'] ?? { damping: 11, stiffness: 292, mass: 1 },
);

const menuStretchRatioX = mobileTheme.motion.ratio['ratio-menu-stretch-x'] ?? 0.1;
const menuStretchRatioY = mobileTheme.motion.ratio['ratio-menu-stretch-y'] ?? 0.08;
const menuStretchResistance = mobileTheme.motion.ratio['ratio-menu-stretch-resistance'] ?? 0.48;
const menuStretchInsideRatio = mobileTheme.motion.ratio['ratio-menu-stretch-inside'] ?? 0.02;
const menuStretchCoupleRatio = mobileTheme.motion.ratio['ratio-menu-stretch-couple'] ?? 0.32;

/** 橡皮筋衰减（iOS rubber band）：拖得越远越难拉，渐近 `limit`。 */
function rubberBand(distance: number, limit: number) {
  'worklet';
  if (limit <= 0) {
    return 0;
  }
  return limit * (1 - 1 / ((distance * menuStretchResistance) / limit + 1));
}

/**
 * EgMenu 所在屏幕分区 → 可拉伸方向：`x` 1 仅右 · −1 仅左 · 0 左右；`y` 1 仅下 · −1 仅上。
 * 按触发器中心（浮层自此长出）：水平落在窗口三等分的左 / 中 / 右；垂直在窗口上半 / 下半。
 */
export function menuStretchAllowance(
  centerX: number,
  centerY: number,
  windowWidth: number,
  windowHeight: number,
): { x: -1 | 0 | 1; y: -1 | 1 } {
  const third = windowWidth / 3;
  return {
    x: centerX < third ? 1 : centerX > third * 2 ? -1 : 0,
    y: centerY < windowHeight / 2 ? 1 : -1,
  };
}

/** 位移按允许方向截断：`allow` 0 双向放行，±1 仅保留同号分量。 */
export function menuStretchClampTranslation(translation: number, allow: number) {
  'worklet';
  if (allow > 0) {
    return Math.max(0, translation);
  }
  if (allow < 0) {
    return Math.min(0, translation);
  }
  return translation;
}

/**
 * 手指越出面板 [start, end] 的距离（px · ≥ 0），仅计 `allow` 允许的一侧：
 * 1 仅 end 侧 · −1 仅 start 侧 · 0 两侧。
 */
export function menuStretchOverflow(
  position: number,
  start: number,
  end: number,
  allow: number,
) {
  'worklet';
  const beyondEnd = Math.max(0, position - end);
  const beyondStart = Math.max(0, start - position);
  if (allow > 0) {
    return beyondEnd;
  }
  if (allow < 0) {
    return beyondStart;
  }
  return Math.max(beyondEnd, beyondStart);
}

/**
 * 拖拽位移 → 拉伸量（px · ≥ 0）。
 * - 手指在面板内：仅极小变形（橡皮筋上限 = 全量 limit × ratio-menu-stretch-inside）
 * - 越出面板边缘：`overflow` 1:1 驱动大幅变形（上限 = 全量 limit）
 */
export function menuStretchAmount(
  translation: number,
  overflow: number,
  size: number,
  axis: 'x' | 'y',
) {
  'worklet';
  const ratio = axis === 'x' ? menuStretchRatioX : menuStretchRatioY;
  const limit = size * ratio;
  const inside = rubberBand(Math.abs(translation), limit * menuStretchInsideRatio);
  const outside = rubberBand(Math.max(0, overflow), limit);
  return Math.min(limit, inside + outside);
}

/**
 * 主轴 `amountX/Y` 为拖拽方向额外宽/高；次轴按 `ratio-menu-stretch-couple` 联动收缩（主轴拉长 → 次轴略窄）。
 */
export function menuStretchScales(
  amountX: number,
  amountY: number,
  width: number,
  height: number,
): { scaleX: number; scaleY: number } {
  'worklet';
  const safeW = Math.max(1, width);
  const safeH = Math.max(1, height);
  const couple = menuStretchCoupleRatio;
  let scaleX = 1 + amountX / safeW - (couple * amountY) / safeH;
  let scaleY = 1 + amountY / safeH - (couple * amountX) / safeW;
  const minScaleX = 1 - couple * menuStretchRatioY;
  const minScaleY = 1 - couple * menuStretchRatioX;
  scaleX = Math.max(minScaleX, Math.min(1 + menuStretchRatioX, scaleX));
  scaleY = Math.max(minScaleY, Math.min(1 + menuStretchRatioY, scaleY));
  return { scaleX, scaleY };
}

/**
 * 拉伸层 · `amountX/Y` 为额外宽 / 高（px；松手回弹时可短暂 < 0），`dirX/Y` 为拖拽方向（±1）。
 * 以中心缩放后平移半个增量，使对侧边缘不动、朝手指方向展开；次轴收缩只进 scale、不加平移。
 */
export function menuStretchStyle(
  amountX: number,
  amountY: number,
  dirX: number,
  dirY: number,
  width: number,
  height: number,
) {
  'worklet';
  const { scaleX, scaleY } = menuStretchScales(amountX, amountY, width, height);
  return {
    transform: [
      { translateX: (dirX * amountX) / 2 },
      { translateY: (dirY * amountY) / 2 },
      { scaleX },
      { scaleY },
    ],
  };
}

/** 拉伸中的窗口 Y → 未拉伸坐标（命中区按静止布局测得）。`centerY` 为面板中心窗口 Y。 */
export function menuStretchUnmapY(
  windowY: number,
  amountX: number,
  amountY: number,
  dirY: number,
  centerY: number,
  width: number,
  height: number,
) {
  'worklet';
  const { scaleY } = menuStretchScales(amountX, amountY, width, height);
  return centerY + (windowY - centerY - (dirY * amountY) / 2) / scaleY;
}

/** Base `motion-scale-menu-origin`。 */
export const menuOriginScale = mobileTheme.motion.scale['scale-menu-origin'] ?? 0.2;

/** Base `motion-scale-menu-trigger-lift`。 */
export const menuTriggerLift = mobileTheme.motion.scale['scale-menu-trigger-lift'] ?? 1.15;
/** 触发器与水滴在 progress 这段内交叉融合：展开时触发器鼓起淡出、水滴淡入；收回逆序。 */
const MENU_HANDOFF = 0.22;
/** 内容自该 progress 起逐行显出（启动 `menuContentRow*` 时钟）；外壳圆角至 `MENU_CONTENT_END` 到位。 */
export const MENU_CONTENT_START = 0.35;
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

/** 内容层整体：仅收回时随外壳缩小中段隐去；展开由 `menuContentRowOpacity` 逐行显出。 */
export function menuContentOpacity(progress: number, reduceMotion: boolean, closing: boolean) {
  'worklet';
  if (reduceMotion || !closing) {
    return 1;
  }
  return smooth01(
    (progress - MENU_CLOSE_CONTENT_START) / (MENU_CLOSE_CONTENT_END - MENU_CLOSE_CONTENT_START),
  );
}

function readMenuTiming(iosKey: string) {
  const timing = mobileTheme.motion.timings[iosKey];
  if (!timing?.duration) {
    throw new Error(`menuMotion: missing mobileTheme.motion.timings['${iosKey}']`);
  }
  return timing;
}

function bezierFromCss(cubicBezier: string | undefined): [number, number, number, number] {
  const match = /cubic-bezier\(\s*([^)]+)\s*\)/.exec(cubicBezier ?? '');
  const parts = match?.[1]?.split(',').map((part) => Number.parseFloat(part.trim()));
  return parts && parts.length === 4 && parts.every((value) => Number.isFinite(value))
    ? (parts as [number, number, number, number])
    : [0, 0, 0.2, 1];
}

const contentOpacity = readMenuTiming('ios-menu-content-in');
const contentStagger = readMenuTiming('ios-menu-content-in-stagger');
const contentOpacityMs = contentOpacity.duration as number;
const contentStaggerMs = contentStagger.duration as number;
const contentOpacityEasing = Easing.bezierFn(...bezierFromCss(contentOpacity.easing as string));
const contentOffsetY = mobileTheme.motion.offset['offset-menu-content-y'] ?? 16;

const contentWave = mobileTheme.motion.springByName['menu-content-wave'];
const waveMass = contentWave?.mass ?? 1;
const waveStiffness = contentWave?.stiffness ?? 385;
const waveDamping = contentWave?.damping ?? 20;
const waveOmega = Math.sqrt(waveStiffness / waveMass);
const waveZeta = Math.min(1, waveDamping / (2 * Math.sqrt(waveStiffness * waveMass)));
const waveDampedOmega = waveOmega * Math.sqrt(1 - waveZeta * waveZeta);
/** 包络衰减到起始偏移 1% 的时长（毫秒）— 逐行时钟需覆盖到此才算落定。 */
const waveSettleMs = (Math.log(100) / (waveZeta * waveOmega)) * 1000;

/** spring.menu-content-wave 自位移 1 释放（初速 0）· t 秒后剩余位移（欠阻尼时会冲过 0 再回落）。 */
function waveDisplacement(t: number) {
  'worklet';
  if (t <= 0) {
    return 1;
  }
  const decay = Math.exp(-waveZeta * waveOmega * t);
  if (waveDampedOmega < 1e-6) {
    return decay * (1 + waveOmega * t);
  }
  return (
    decay *
    (Math.cos(waveDampedOmega * t) +
      ((waveZeta * waveOmega) / waveDampedOmega) * Math.sin(waveDampedOmega * t))
  );
}

/** 逐行显出时钟总时长（毫秒）：末行起步延迟 + 单行淡入 / 波浪落定较长者。 */
export function menuContentRevealTotalMs(count: number) {
  return Math.max(0, count - 1) * contentStaggerMs + Math.max(contentOpacityMs, waveSettleMs);
}

/**
 * 展开 · 第 `index` 行；`elapsedMs` 自 progress 越过 `MENU_CONTENT_START` 起计。
 * 自上而下逐行起步（menu-content-in-stagger）：淡入（menu-content-in）先完成，
 * 自 offset-menu-content-y 上移走 spring.menu-content-wave — 冲过落点再回落，逐行错峰成波浪。
 */
export function menuContentRowStyle(elapsedMs: number, index: number, reduceMotion: boolean) {
  'worklet';
  if (reduceMotion) {
    return { opacity: 1, transform: [{ translateY: 0 }] };
  }
  const local = elapsedMs - index * contentStaggerMs;
  const opacity = contentOpacityEasing(clamp01(local / contentOpacityMs));
  return {
    opacity,
    transform: [{ translateY: contentOffsetY * waveDisplacement(local / 1000) }],
  };
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
