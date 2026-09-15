# EDS Mobile Motion

统一架构（与架构文档一致）：

```text
Base → Recipe → Semantic
```

**Semantic 沿用现有 class**（`motion-tap` / `motion-page` / `motion-flotation` 等），**不采用**文档中的 8 场景分组（Navigation / Presentation / Interaction …）。

---

## 1. Base — 「参数是什么？」

`base.json` → `dist/css/motion/base.css`

| 类别 | 内容 |
|------|------|
| Timing | duration ladder · easing |
| Physics | **Spring**（response / dampingFraction / reanimated） |
| Transform | distance · scale |
| Visual | opacity |
| Interaction | velocityAware · interruptible · preserveVelocity |
| Haptic | selection · light · success … |

Base 是**唯一**保存完整底层参数的层。

---

## 2. Recipe — 「怎么组合？」

`recipe.json` → `dist/css/motion/recipe.css`

- `namedRecipes[]`：press / navigation / sheet / control … → 引用 Base（`springRef` / `timingRef` / `hapticRef`）
- RN 字段：`velocityAware` · `interruptible` · `semanticClass` · `label`
- CSS `--motion-recipe-*`：Web transition 配方（引用 Base duration/easing）

Recipe **不重复定义** Base 数值。

---

## 3. Semantic — 「属于哪个场景？」

`semantic.json` → `semantic.css` + `utilities.css`

| class | recipe |
|-------|--------|
| `.motion-tap` | press |
| `.motion-focus` | enter |
| `.motion-layout` | enter |
| `.motion-flotation` | sheet |
| `.motion-deform` | control |
| `.motion-page` | navigation |
| `.motion-layout-deform` | layout-deform |

Semantic **只引用 recipe id**，不存 spring 数值。

RN 多步编排见 `semantic.json` → `compositions[]`（ios-sheet / ios-navigation / transaction …）。

Reduce Motion 见 `semantic.json` → `reducedMotion` + utility class `motion-reduced-fade`。

---

## 解析链

```text
.motion-tap  →  recipe: press  →  base: spring.press + haptic.light
.motion-page  →  recipe: navigation  →  base: spring.navigation + timing.navigationPush
ios-sheet (composition)  →  recipes: sheet + interactive + dismiss
```

Dev Inspect / catalog：`@eds/mobile-tokens/motion/catalog` → `resolution` 字段

---

## RN

由 **同一份 spec** 生成 `@eds/mobile-animations`：

```typescript
import { mobileMotion, resolveMotionRecipe, resolveMotionComposition } from '@eds/mobile-animations';

const press = resolveMotionRecipe('press');
const sheet = resolveMotionComposition('ios-sheet');
```

Crypto 等业务**复用**上述 Semantic / Composition，不另建 Motion 层。

---

## 入口

```css
@import '@eds/mobile-tokens/motion'; /* base + recipe + semantic + utilities */
```
