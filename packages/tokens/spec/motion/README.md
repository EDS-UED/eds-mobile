# EDS Mobile Motion

```text
Base → Recipe → Semantic
```

**Semantic class** 与 RN **`EdsSemanticAnima('<scenarioId>')`** 同名：`className = motion-{scenarioId}`。

当前 spec 含 **`press`** · **`slide`** · **`layout-content`** · **`menu`** · **`sheets`** · **`page`** · **`page-shot`** 七个场景；新增 Semantic 时按需补 Base / Recipe（勿私造未引用参数）。

---

## 1. Base

`base.json` → `dist/css/motion/base.css` · RN `mobileTheme.motion`

---

## 2. Recipe

`recipe.json` → `namedRecipes[]` + `--motion-recipe-*`

| id | 用途 |
|----|------|
| `press` | 按下 |
| `press-scale-out` | 松手回弹（无独立 Semantic） |
| `slide` | 滑选落位 |
| `drag` | slide 跟手（无独立 Semantic） |
| `layout-content` | 同壳正文 crossfade |
| `menu` | 浮层自触发点倒出 |
| `menu-dismiss` | 浮层收回（无独立 Semantic） |
| `sheets` | Sheet 呈现（悬浮 ↔ 贴边） |
| `sheets-detent` | Sheet 档位吸附（无独立 Semantic） |
| `sheets-dismiss` | Sheet 收起（无独立 Semantic） |
| `page` | 普通页面左右切换（下层视差 · 轻回弹；弹层内同用） |
| `page-back` | 返回 / 侧滑返回（无独立 Semantic） |
| `page-shot` | 弹层页面 / 卡片展开整页（App Store Today · 内可嵌套 `page`） |
| `page-shot-dismiss` | 整页飞回源 frame / 下拉收起（无独立 Semantic） |

---

## 3. Semantic

| class | scenarioId | recipe |
|-------|------------|--------|
| `.motion-press` | `press` | `press` |
| `.motion-slide` | `slide` | `slide` |
| `.motion-layout-content` | `layout-content` | `layout-content` |
| `.motion-menu` | `menu` | `menu` |
| `.motion-sheets` | `sheets` | `sheets` |
| `.motion-page` | `page` | `page` |
| `.motion-page-shot` | `page-shot` | `page-shot` |

**页面切换（声明）**：普通左右切换 → `page`；弹层页面、卡片等 → `page-shot`（触发元素不同，动效一致）；二者可互相嵌套。业务页面切换默认 `createEgEdsAnimaPageNavigator()` + `screenOptions={EgEdsAnimaPage({ direction, dragDismiss })}`（`@eds/mobile-components`）— iOS 26+ 系统 native-stack（系统 NavBar 样式 / 交互 / 转场），Android · iOS ≤25 走本 spec spring + `EgNavBar`；page-shot 弹层内页面栈同理；弹层页面 / 卡片用 `EgEdsAnimaPageShot` + `EgEdsAnimaPageShotTrigger`。

---

## RN

| 层 | 入口 |
|----|------|
| Base | `mobileTheme.motion`（`motion-ratio-*` → `.ratio`）· Showcase `base-*` |
| Recipe | `EdsRecipeAnima('<recipeId>')` |
| Semantic | `EdsSemanticAnima('<scenarioId>')` |

```typescript
import { EdsRecipeAnima, EdsSemanticAnima } from '@eds/mobile-animations';

EdsSemanticAnima('press');
EdsSemanticAnima('slide');
EdsSemanticAnima('page');
EdsSemanticAnima('page-shot');
EdsRecipeAnima('press-scale-out');
EdsRecipeAnima('drag');
```

`compositions[]` 暂空；多步编排后续随 Semantic 增加再写 spec。

---

## 入口

```css
@import '@eds/mobile-tokens/motion';
```
