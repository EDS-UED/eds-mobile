# EDS Mobile Token CSS 参考手册

> **输出路径**：`packages/tokens/dist/css/`  
> **包名**：`@eds/mobile-tokens`  
> **生成命令**：`pnpm build:tokens` ← `packages/tokens/spec/`  
> **禁止手改 dist**；变更走 spec → 重建  
> **RN 数值镜像**：`@eds/mobile-tokens/theme` → `dist/js/theme.js`

---

## 目录

1. [文件目录与 npm 入口](#1-文件目录与-npm-入口)
2. [@import 依赖树](#2-import-依赖树)
3. [作用域（Selector）](#3-作用域selector)
4. [架构与引用总链](#4-架构与引用总链)
5. [Scale 尺度](#5-scale-尺度)
6. [Typography 排版](#6-typography-排版)
7. [Motion 动效](#7-motion-动效)
8. [Color 颜色](#8-color-颜色)
9. [Tag 色板](#9-tag-色板)
10. [Effect 效果](#10-effect-效果)
11. [Text Styles 独立入口](#11-text-styles-独立入口)
12. [跨系统引用矩阵](#12-跨系统引用矩阵)
13. [RN mobileTheme 对照](#13-rn-mobiletheme-对照)
14. [8 位 Hex Alpha 速查](#14-8-位-hex-alpha-速查)

---

## 1. 文件目录与 npm 入口

共 **40** 个 CSS 文件。

```
dist/css/
├── index.css                          @eds/mobile-tokens
├── scale/
│   ├── index.css                      @eds/mobile-tokens/scale
│   ├── base.css                       @eds/mobile-tokens/scale/base
│   └── semantic.css                   @eds/mobile-tokens/scale/semantic
├── typography/
│   ├── index.css                      @eds/mobile-tokens/typography
│   ├── fonts.css                      @eds/mobile-tokens/fonts
│   ├── base.css                       @eds/mobile-tokens/typography/base
│   ├── semantic.css                   @eds/mobile-tokens/typography/semantic
│   ├── global.css
│   ├── code-global.css
│   └── bar-subpixel.css
├── motion/
│   ├── index.css                      @eds/mobile-tokens/motion
│   ├── base.css                       @eds/mobile-tokens/motion/base
│   ├── recipe.css                     @eds/mobile-tokens/motion/recipe
│   ├── semantic.css                   @eds/mobile-tokens/motion/semantic
│   └── utilities.css                  @eds/mobile-tokens/motion/utilities
├── color/
│   ├── index.css                      @eds/mobile-tokens/color
│   ├── themes/
│   │   ├── light.css                  @eds/mobile-tokens/color/light
│   │   ├── light/base.css
│   │   ├── light/semantic.css
│   │   ├── dark.css                   @eds/mobile-tokens/color/dark
│   │   ├── dark/base.css
│   │   └── dark/semantic.css
│   └── tag/
│       ├── index.css                  @eds/mobile-tokens/tag
│       ├── themes/light.css           @eds/mobile-tokens/tag/light
│       ├── themes/light/base.css
│       ├── themes/light/semantic.css
│       ├── themes/dark.css            @eds/mobile-tokens/tag/dark
│       ├── themes/dark/base.css
│       └── themes/dark/semantic.css
├── effect/
│   ├── index.css                      @eds/mobile-tokens/effect
│   └── themes/
│       ├── light.css                  @eds/mobile-tokens/effect/light
│       ├── light/base.css
│       ├── light/semantic.css
│       ├── dark.css                   @eds/mobile-tokens/effect/dark
│       ├── dark/base.css
│       └── dark/semantic.css
├── liquid-glass/
│   ├── index.css                      @eds/mobile-tokens/liquid-glass/css
│   ├── architecture.css               玻璃材质栈说明（spec/liquid-glass/system.json）
│   └── ready.css                      Web initLiquidGlass ready hook
└── text/
    ├── index.css                      @eds/mobile-tokens/text
    └── styles.css                     @eds/mobile-tokens/text/styles
```

---

## 2. @import 依赖树

```
index.css
├── scale/index.css → base.css → semantic.css
├── typography/index.css
│   ├── fonts.css → ../../assets/fonts/*.ttf
│   ├── base.css → semantic.css
│   ├── global.css / code-global.css / bar-subpixel.css
├── motion/index.css
│   ├── base.css → recipe.css → semantic.css → utilities.css
├── color/index.css
│   ├── themes/light.css → light/{base,semantic}.css
│   ├── themes/dark.css  → dark/{base,semantic}.css
│   └── tag/index.css → tag/themes/{light,dark}.css → {base,semantic}.css
└── effect/index.css
    ├── themes/light.css → light/{base,semantic}.css
    ├── themes/dark.css  → dark/{base,semantic}.css
    └── ready.css

text/index.css → styles.css   （不在 index.css 内，需单独引入）
```

---

## 3. 作用域（Selector）

| 选择器 | 适用文件 |
|--------|----------|
| `:root` | scale、typography |
| `:root, .mobileTokens` | motion base / recipe / utilities |
| `:root, [data-theme="light"]` | color light、tag light base/semantic |
| `[data-theme="dark"]` | color dark、tag dark base/semantic |
| `[data-theme="light"]` / `[data-theme="dark"]` | effect base / semantic class |

Showcase 切换主题：`document.documentElement.setAttribute('data-theme', 'light'|'dark')`。

---

## 4. 架构与引用总链

```
spec/*.json
    ↓ build.mjs
dist/css/{scale,typography,motion,color,effect,text}/
dist/js/theme.js          ← RN StyleSheet 数值
dist/json/tokens.json     ← 全量 JSON
dist/json/motion/catalog.json
```

**分层模型**

| 层 | 目录 | 变量前缀 | 消费 |
|----|------|----------|------|
| Base | `*/base.css` | `--eds-*`、`--scale-*`、`--eds-motion-*` | 被上层 var() 引用 |
| Semantic | `*/semantic.css` | `--text-*`、`--spacing-*`、`--eds-body-*` | 组件 / class |
| Recipe | `motion/recipe.css` | `--motion-recipe-*` | semantic class |
| Semantic Class | `motion/semantic.css`、`effect/*/semantic.css` | `.motion-*`、`.effect-*` | Web / Showcase |
| RN | `theme.js` | `mobileTheme.*` | `@eds/mobile-components` |

**颜色引用链**

```
color/themes/{theme}/base.css       --eds-* 基色
        ↓ var(--eds-brand) 等
color/themes/{theme}/semantic.css   --text-* / --material-* / --event-*
        ↓
color/tag/themes/{theme}/base.css   --eds-tag-*
        ↓ var(--eds-tag-*)
color/tag/themes/{theme}/semantic.css  --tag-*
        ↓
effect/themes/{theme}/base.css      --eds-shadow-* / --eds-glass-*（引用 --eds-face 等）
```

> **颜色格式**：每个 `--eds-*` 基色写两行——第 1 行 `#hex`（sRGB 回退），第 2 行 `color(display-p3 …)`（正式值）。

---

## 5. Scale 尺度

**Spec**：`spec/scale/base.json`、`spec/scale/semantic.json`

### 5.1 Base — `scale/base.css`

公式：`scale(n) = n × var(--scale-base)`，`--scale-base: 4px`

| 变量 | 值 |
|------|-----|
| `--scale-0` | `0px` |
| `--scale-025` | `1px` |
| `--scale-05` | `2px` |
| `--scale-055` | `2.2px` |
| `--scale-1` | `4px` |
| `--scale-1-5` | `6px` |
| `--scale-2` | `8px` |
| `--scale-3` | `12px` |
| `--scale-4` | `16px` |
| `--scale-5` | `20px` |
| `--scale-5-5` | `22px` |
| `--scale-6` | `24px` |
| `--scale-7` | `28px` |
| `--scale-8` | `32px` |
| `--scale-9` | `36px` |
| `--scale-10` | `40px` |
| `--scale-11` … `--scale-20` | `44px` … `80px` |
| `--scale-30` / `--scale-40` / `--scale-50` | `120px` / `160px` / `200px` |
| `--scale-full` | `888px` |

### 5.2 Semantic — `scale/semantic.css`

> 语义层为**字面 px**（与 `--scale-N` 数值对齐，但不写 `var(--scale-N)`）。

**Spacing**

| 变量 | 值 | 变量 | 值 |
|------|-----|------|-----|
| `--spacing-0` | `0px` | `--spacing-10` | `40px` |
| `--spacing-05` | `2px` | `--spacing-12` | `48px` |
| `--spacing-1` | `4px` | `--spacing-14` | `56px` |
| `--spacing-1-5` | `6px` | `--spacing-16` | `64px` |
| `--spacing-2` | `8px` | `--spacing-18` | `72px` |
| `--spacing-3` | `12px` | `--spacing-20` | `80px` |
| `--spacing-4` | `16px` | | |
| `--spacing-5` | `20px` | | |
| `--spacing-6` | `24px` | | |
| `--spacing-7` | `28px` | | |
| `--spacing-8` | `32px` | | |
| `--spacing-9` | `36px` | | |

**Radius / Stroke / Blur / Depth**

| 变量 | 值 |
|------|-----|
| `--radius-0` | `0px` |
| `--radius-xs` | `12px` |
| `--radius-sm` | `16px` |
| `--radius-md` | `20px` |
| `--radius-lg` | `16px` |
| `--radius-xl` | `20px` |
| `--radius-full` | `888px` |
| `--stroke-xs` … `--stroke-xl` | `0.2px` / `scale-0125` (0.5px) / `scale-025` (1px) / `scale-0375` (1.5px) / `scale-05` (2px) |
| `--blur-deep` / `--blur-moderate` / `--blur-shallow` | `40px` / `80px` / `200px` |
| `--depth-deep` / `--depth-moderate` / `--depth-shallow` | `8px` / `16px` / `32px` |

**Symbol**

| `--symbol-sm` | `--symbol-md` | `--symbol-lg` | `--symbol-xl` |
|---------------|---------------|---------------|---------------|
| `16px` | `20px` | `22px` | `24px` |

**控件高度（px）**

| 尺寸 | Button | Capsule | Input | Dropdown |
|------|--------|---------|-------|----------|
| xs | 32 | 36 | 32 | 32 |
| sm | 40 | 40 | 40 | 40 |
| md | 48 | 48 | 48 | 48 |
| lg | 56 | 52 | 52 | 52 |
| xl | 60 | 56 | 56 | 56 |

**Toggle / Tag / Avatar** — 见 `dist/css/scale/semantic.css`；RN 对应 `mobileTheme.spacing['button-md']` 等。

**Input 专用**

| 变量 | 值 |
|------|-----|
| `--input-combo-leading-width` | `88px` |
| `--input-pointer-width` | `2px` |
| `--input-pointer-height` | `22px` |

**Preview 壳（showcase Native）**

| 变量 | 值 |
|------|-----|
| `--preview-screen-width` | `390px` |
| `--preview-min-height` | `48px` |
| `--preview-height-default` | `400px` |
| `--preview-height-compact` | `280px` |
| `--preview-popup-width` | `1280px` |

完整列表见 `dist/css/scale/semantic.css`。

---

## 6. Typography 排版

**Spec**：`spec/typography/base.json`、`semantic.json`、`spec/text/styles.json`

### 6.1 Base — `typography/base.css`

| 分组 | 变量 | 值 |
|------|------|-----|
| 字号 | `--size-display` … `--size-bar` | `34, 26, 21, 19, 17, 15, 14, 13, 10, 12` px |
| 行高 | `--line-height-display` … | `44, 32, 28, 26, 24, 20, 18, 16, 14, 12` px |
| 字重 | `--weight-regular/medium/semibold/bold` | `400 / 500 / 600 / 700` |
| 字体栈 | `--eds-family-sans` | `"EDS Text", "PingFang SC", SourceHanSansSC, …` |
| | `--eds-family-mono` | `"IBM Plex Mono", ui-monospace, monospace` |

### 6.2 Semantic 引用链 — `typography/semantic.css`

```
--size-body-medium: 17px
        ↓
--eds-body-medium-size: var(--size-body-medium)
--eds-body-medium-weight: var(--weight-regular)
--eds-body-medium-line-height: var(--line-height-body-medium)
        ↓
.typography-body-medium { font-size: var(--eds-body-medium-size); … }
```

**全部 Text Style 角色**

| 角色 | size | weight | line-height |
|------|------|--------|-------------|
| display | 34 | bold(700) | 44 |
| headline | 26 | bold | 32 |
| title | 21 | bold | 28 |
| body-large | 19 | regular | 26 |
| body-large-strong | 19 | medium(500) | 26 |
| body-large-heavy | 19 | bold(700) | 26 |
| body-medium | 17 | regular | 24 |
| body-medium-strong | 17 | medium(500) | 24 |
| body-medium-heavy | 17 | semibold(600) | 24 |
| body-small | 15 | regular | 20 |
| body-small-strong | 15 | medium(500) | 20 |
| body-small-heavy | 15 | semibold(600) | 20 |
| detail / detail-strong | 14 | regular/semibold | 18 |
| footnote / footnote-strong | 13 | regular/semibold | 16 |
| bar / bar-strong | 10 | medium/semibold | 14 |

### 6.3 字体文件 — `typography/fonts.css`

| Family | 文件 |
|--------|------|
| EDS Text | `assets/fonts/EDSText-{Regular,Medium,SemiBold,Bold}.ttf` |
| IBM Plex Mono | `assets/fonts/IBMPlexMono-{Regular,Medium,SemiBold,Bold}.ttf` |

RN：`@eds/mobile-tokens/fonts-native` + `expo-font`；Web：`@eds/mobile-tokens/fonts`。

---

## 7. Motion 动效

**Spec**：`spec/motion/base.json`、`recipe.json`、`semantic.json`  
**RN**：`@eds/mobile-animations`（`resolveMotionRecipe` / `resolveMotionComposition`）

### 7.1 Base — `motion/base.css`

**Duration**

| 变量 | 值 | 角色 |
|------|-----|------|
| `--eds-motion-0` | `0ms` | instant |
| `--eds-motion-1` | `85ms` | micro / tap |
| `--eds-motion-2` | `180ms` | fast / fade |
| `--eds-motion-3` | `280ms` | normal / enter |
| `--eds-motion-4` | `400ms` | slow |
| `--eds-motion-5` | `500ms` | emphasis |
| `--eds-motion-6` | `250ms` | control |
| `--eds-motion-7` | `350ms` | navigation |
| `--eds-motion-8` | `800ms` | spin |
| `--eds-motion-9` | `2000ms` | spin-slow |

**Easing**

| 变量 | 值 |
|------|-----|
| `--eds-motion-ease-1` | `cubic-bezier(0.42, 0, 0.58, 1)` standard |
| `--eds-motion-ease-2` | `cubic-bezier(0.2, 0, 0, 1)` enter |
| `--eds-motion-ease-3` | `cubic-bezier(0.4, 0, 1, 1)` exit |
| `--eds-motion-ease-4` | `cubic-bezier(0.4, 0, 0.2, 1)` product |
| `--eds-motion-ease-5` | `linear` |
| `--eds-motion-ease-6/7` | spring-emphasis |
| `--eds-motion-ease-8` | decelerate |
| `--eds-motion-ease-9` | `cubic-bezier(0.32, 0.72, 0, 1)` navigation |

**Opacity / Scale / Distance**

| 变量 | 值 |
|------|-----|
| `--motion-opacity-hidden/dim/subtle/visible/disabled` | `0 / 0.4 / 0.7 / 1 / 0.5` |
| `--motion-scale-press`（default md） | `1.2` |
| `--motion-scale-press-xs/sm/md/lg` | `1.02 / 1.04 / 1.2 / 1.35` |
| `--motion-glass-scale-press-xs/sm/md/lg` | `1.02 / 1.04 / 1.2 / 1.35` |
| `--motion-scale-subtle/emphasis/present` | `0.98 / 1.04 / 0.96` |
| `--motion-distance-xs/sm/md/lg/xl` | `4 / 8 / 16 / 24 / 40` px |
| `--motion-offset-sheets-inset` / `--motion-offset-sheets-top` | `var(--spacing-2)` / `var(--spacing-0)`（距系统条 safe area top） |
| `--motion-offset-layout-deform-y` | `var(--spacing-2-5)` ※ |

※ `--spacing-2-5` 在 spec 中定义（= `10px`），若 dist 未生成该 token 需同步 scale spec。

**Spring / Haptic** — 见 `dist/css/motion/base.css`；RN 映射 `--eds-ios-spring-*` → Reanimated `withSpring`。

### 7.2 Recipe — `motion/recipe.css`

```
--eds-motion-1  →  --motion-duration-press
--eds-motion-ease-1  →  --motion-easing-standard
        ↓
--motion-recipe-press: background-color var(--motion-duration-press) var(--motion-easing-standard), transform …
--motion-recipe-enter / exit / shift / page-push / layout-deform-* / sheets / scroll-fade …
```

`@media (prefers-reduced-motion: reduce)` 将 duration 全部降为 `--eds-motion-0`。

### 7.3 Semantic Class — `motion/semantic.css`

| Class | transition 引用 | 说明 |
|-------|-----------------|------|
| `.motion-press` | `--motion-recipe-press` | 点按；`.is-active` → `scale(var(--motion-scale-press))` |
| `.motion-focus` | `--motion-recipe-enter` | Input/Search 聚焦 |
| `.motion-layout` | `--motion-recipe-enter` | 大位移进出场 |
| `.motion-sheets` | `--motion-recipe-sheets` | EgSheets（`.is-attached` / `.is-dismissed`） |
| `.motion-deform` | `--motion-recipe-control` | Tab 指示器 / Toggle |
| `.motion-page` | `--motion-recipe-page-push` | 页面 Push/Pop |
| `.motion-layout-deform` | `--motion-recipe-layout-deform-shell` | 容器 morph |
| `.motion-none` | `none` | Reduce motion |
| `.motion-reduced-fade` | opacity + `--motion-duration-fade` | 仅 fade 降级 |

---

## 8. Color 颜色

**Spec**：`spec/color/base.json`、`semantic.json`、`tag-palette.json`  
**Figma**：Primitives `2008:41`；Semantic `2536:5814`

### 8.1 Base 基色 `--eds-*`

#### Light — `color/themes/light/base.css`

| 变量 | Hex（回退） | display-p3 |
|------|-------------|------------|
| `--eds-base` | `#000000` | `0 0 0` |
| `--eds-brand` | `#5f2243` | `0.3725 0.1333 0.2627` |
| `--eds-danger` | `#d7462d` | `0.8431 0.2745 0.1765` |
| `--eds-decor` | `#044020` | display-p3 由 build 生成 |
| `--eds-face` | `#ffffff` | `1 1 1` |
| `--eds-flotation` | `#ffffff` | `1 1 1` |
| `--eds-match` | `#003a6d` | `0 0.2275 0.4275` |
| `--eds-page` | `#ffffff` | `1 1 1` |
| `--eds-page-card` | `#f7f7f7` | `0.9686 0.9686 0.9686` |
| `--eds-same-black` | `#000000` | 同 base |
| `--eds-same-white` | `#ffffff` | `1 1 1` |
| `--eds-success` | `#1fc35a` | `0.1216 0.7647 0.3529` |
| `--eds-warning` | `#eb9114` | `0.9216 0.5686 0.0784` |

#### Dark — `color/themes/dark/base.css`

| 变量 | Hex | 备注 |
|------|-----|------|
| `--eds-base` | `#ffffff` | 反转 |
| `--eds-brand` | `#5f2243` | **与 Light 相同** |
| `--eds-danger` | `#fa6950` | |
| `--eds-decor` | `#ffffff` | |
| `--eds-face` | `#000000` | |
| `--eds-flotation` | `#1c1d1f` | |
| `--eds-match` | `#004178` | |
| `--eds-page` | `#000000` | |
| `--eds-success` | `#1fc35a` | 同 Light |
| `--eds-warning` | `#ffaa32` | |

### 8.2 Semantic — Light（`color/themes/light/semantic.css`）

#### Box

| 变量 | 值 |
|------|-----|
| `--box-page` | `#ffffff` |
| `--box-flotation` | `#ffffff` |

#### Stroke

| 变量 | 值 |
|------|-----|
| `--stroke-hide` | `#00000000` |
| `--stroke-divider-deep` | light 10% base · dark 10% base |
| `--stroke-divider-shallow` | light 8% base · dark 10% base |
| `--stroke-base-primary` | `#000000` |
| `--stroke-base-secondary` | `#00000099` |
| `--stroke-base-tertiary` | `#00000066` |
| `--stroke-base-quaternary` | `#00000033` |
| `--stroke-color-brand` | `var(--eds-brand)` → `#5f2243` |
| `--stroke-color-danger` | `#d7462d` |
| `--stroke-decor` | `var(--eds-decor)` · 浅 `#044020` / 深 `#ffffff` |
| `--stroke-same-white` | `#ffffff` |

#### Text

| 变量 | 值 | 组件用途 |
|------|-----|----------|
| `--text-base-primary` | `#000000` | 正文 |
| `--text-base-secondary` | `#00000099` | |
| `--text-base-tertiary` | `#00000066` | 占位符 |
| `--text-base-quaternary` | `#00000033` | Tap 占位 |
| `--text-brand` | `var(--eds-brand)` | Paste / Max |
| `--text-face-primary` | `#ffffff` | 深底文字 |
| `--text-face-secondary` | `#ffffff99` | |
| `--text-face-tertiary` | `#ffffff66` | |
| `--text-face-quaternary` | `#ffffff33` | |
| `--text-same-black` | `#000000` | |
| `--text-same-white` | `#ffffff` | |
| `--text-same-white-weaken` | `#ffffff66` | |

#### Material

| 变量 | 值 |
|------|-----|
| `--material-hide` | `#00000000` |
| `--material-base-primary` | `#000000` |
| `--material-base-secondary` | `#00000099` |
| `--material-base-tertiary` | `#00000066` |
| `--material-base-quaternary` | `#00000033` |
| `--material-card-shallow` | `#00000008` |
| `--material-card-moderate` | `#0000000d` |
| `--material-card-deep` | `#00000012` |
| `--material-card-moderate` | `#0000000a` |
| `--material-card-deep` | `#0000000d` |
| `--material-card-same-white` | `var(--eds-same-white)` |
| `--material-brand` | `var(--eds-brand)` |
| `--material-brand-weaken` | `color-mix(in display-p3, var(--eds-brand) 12%, transparent)` |
| `--material-match` | `#003a6d` |
| `--material-match-weaken` | `#003a6d1f` |
| `--material-decor` | `#022d0d` |
| `--material-decor-weaken` | `#022d0d1f` |
| `--material-face-primary` | `#ffffff` |
| `--material-face-secondary` | `#ffffff99` |
| `--material-face-tertiary` | `#ffffff66` |
| `--material-face-quaternary` | `#ffffff33` |
| `--material-same-black` | `#00000080` |
| `--material-same-black-weaken` | `#00000033` |
| `--material-same-white` | `#ffffff` |
| `--material-same-white-weaken` | `#ffffff` |

#### Status

| 变量 | 值 |
|------|-----|
| `--status-disable-base` | `#00000033` |
| `--status-disable-base-weaken` | `#0000000d` |
| `--status-disable-brand` | `color-mix(…, brand 40%, transparent)` |
| `--status-disable-brand-weaken` | `color-mix(…, brand 20%, transparent)` |
| `--status-disable-same-white` | `#ffffff` |
| `--status-success` | `#1fc35a` |
| `--status-success-weaken` | `#1fc35a1f` |
| `--status-danger` | `#d7462d` |
| `--status-danger-weaken` | `#d7462d1f` |
| `--status-warning` | `#eb9114` |
| `--status-warning-weaken` | `#eb91141f` |

#### Effect 色 / Event / 文档

| 变量 | 值 |
|------|-----|
| `--effect-shallow` | `#0000001a` |
| `--effect-moderate` | `#0000001f` |
| `--effect-deep` | `#00000033` |
| `--effect-prompt` | `#000000cc` |
| `--event-tap` | `#0000001a` |
| `--event-tap-brand` | `color-mix(…, brand 60%, transparent)` |
| `--event-tap-decor` | `#022d0d99` |
| `--event-tap-danger` | `#d7462d99` |
| `--event-tap-base` | `#00000099` |
| `--event-tap-face` | `#ffffff99` |
| `--event-focus` | `#0000000d` |
| `--event-focus-brand` | `color-mix(…, brand 10%, transparent)` |

Showcase 文档专用色（Customize 标注 / 代码高亮）不在 Color System semantic 内，见 `apps/showcase/src/theme/showcaseDocColors.ts`。

### 8.3 Semantic — Dark 要点

Dark 与 Light **同名 token**，主色从 `#000000` 翻转为 `#ffffff` 系：

| Token | Light | Dark |
|-------|-------|------|
| `--box-page` | `#ffffff` | `#000000` |
| `--box-flotation` | `#ffffff` | `#1c1d1f` |
| `--box-page-card` | `#f7f7f7` | `#000000` |
| `--text-base-primary` | `#000000` | `#ffffff` |
| `--material-card-moderate` | `#0000000a` | `#ffffff12` |

**引用 brand 的 token（两主题相同链）**

```
--text-brand / --material-brand / --stroke-color-brand
    → var(--eds-brand) → #5f2243

--event-tap-brand         → color-mix(brand 60%)
--event-focus-brand       → color-mix(brand 12% light / 14% dark)
--material-brand-weaken   → color-mix(brand 12%)
```

---

## 9. Tag 色板

**引用链**：`--tag-*` → `var(--eds-tag-*)` → Hex + display-p3

完整逐字清单（含 display-p3 第二行）见 `dist/css/color/tag/themes/{light,dark}/base.css`。

### 9.1 Tag Status

| Token | Light bg / text | Dark bg / text |
|-------|-----------------|----------------|
| danger | `#ffcdd2` / `#7c0b17` | `#50302a` / `#ff6262` |
| warning | `#ffebb2` / `#78370f` | `#55412d` / `#ffc373` |
| success | `#b5f4c7` / `#096122` | `#08462d` / `#00d888` |
| ready | `#c8d7fa` / `#04398b` | `#263b5b` / `#297eff` |
| invalid | `#d7d9db` / `#56585a` | `#3e454a` / `#7f8993` |

### 9.2 Tag Colorful（18 色）

| 名称 | Light bg / text | Dark bg / text |
|------|-----------------|----------------|
| apricot | `#fae1c8` / `#a23f0e` | `#4d372c` / `#ff8042` |
| khaki | `#e4e4bc` / `#836127` | `#4c462d` / `#e1e195` |
| grass | `#c2f3b5` / `#1d8a00` | `#2b4a22` / `#7fff5d` |
| sage | `#a9e3d8` / `#007676` | `#1f523b` / `#35e7a8` |
| cyan | `#8ef2f2` / `#007878` | `#1c5353` / `#5ed3d3` |
| ice-blue | `#b0f4fe` / `#066472` | `#015c6a` / `#26cfe7` |
| periwinkle | `#bce1ff` / `#004c8a` | `#174163` / `#48adff` |
| lilac | `#c8caff` / `#381191` | `#3a3a6f` / `#9b87ff` |
| orchid | `#d7c3fe` / `#6d0b81` | `#513270` / `#bc80f1` |
| mallow | `#f1bcfc` / `#770886` | `#623069` / `#d579df` |
| rose | `#fdb9ed` / `#850956` | `#5e2e53` / `#de6fb3` |
| coral | `#ff9adc` / `#970565` | `#612b49` / `#f669c5` |
| mauve | `#d6bebe` / `#8f2525` | `#514141` / `#d78a8a` |
| moss | `#afd1be` / `#086c22` | `#3e5143` / `#7ec591` |
| steel | `#98c6d4` / `#09607b` | `#3e565e` / `#82b7c7` |
| grape | `#cea5d4` / `#770d87` | `#624966` / `#c586ce` |
| samewhite | `#ffffff` / `#000000` | 同 |
| lime | `#a8f858` / `#284908` | 同 |

### 9.3 Tag Custom（bar + 统一 bg/text `#000000`）

| 名称 | bar |
|------|-----|
| vermilion | `#ff3b30` |
| orange | `#ff6b00` |
| amber | `#e6a800` |
| lime | `#78b800` |
| mint | `#00a86b` |
| teal | `#00bfa5` |
| clear-sky | `#039be5` |
| cobalt | `#2979ff` |
| aurora | `#651fff` |
| orchid | `#d500f9` |
| rose | `#c2185b` |
| peach | `#ff9e80` |

### 9.4 Tag Mobile Color / Status

| 色名 | Light bg / text / altBg | Dark bg / text / altBg |
|------|-------------------------|-------------------------|
| green | `#bff5dc` / `#0a5537` / `#fff` | `#08462d` / `#00d888` / `#000000` |
| yellow | `#fff0be` / `#78370f` / `#fff` | `#55412d` / `#ffc373` / `#000000` |
| red | `#ffd2d2` / `#6e2319` / `#fff` | `#50302a` / `#ff6262` / `#000000` |
| blue | `#c8d7fa` / `#0f3269` / `#fff` | `#263b5b` / `#297eff` / `#000000` |
| purple | `#e5d7fa` / `#690f69` / `#fff` | `#3a3a6f` / `#9b87ff` / `#000000` |
| blueGrey | `#d7d9db` / `#56585a` / `#fff` | `#3e454a` / `#7f8993` / `#000000` |
| emeraldGreen | `#a8f858` / `#284908` / `#fff` | `#2b4a22` / `#7fff5d` / `#000000` |
| gray | `#fff` / `#000000` / `#0000000d` | `#ffffff12` / `#fff` / `#ffffff12` |

Mobile Status 与 Mobile Color 同值（danger/warning/success/ready/invalid）。

Mobile 语义层：`--tag-mobileColor-*` = `color(var(--eds-tag-mobileColor-*) / 1)`。

---

## 10. Effect 效果

**Spec**：`spec/effect/base.json`、`semantic.json`

### 10.1 Base — Box 阴影 + 毛玻璃

| 变量 | 组成 |
|------|------|
| `--eds-shadow-box-subtle` | outer `effect-vulvar-subtle` |
| `--eds-shadow-box-shallow` | outer `effect-vulvar-shallow` |
| `--eds-shadow-box-deep` | outer `effect-vulvar-deep` |
| `--eds-blur-glass` | `blur(calc(var(--blur-md) / 2))`（Web backdrop；RN → `nativeIntensity`） |

Effect 色：`--effect-box`、`--effect-sheets-background`、`--effect-overlay-{subtle,shallow,deep}`、`--effect-vulvar-*` ← `color/semantic.json`（Sheets Background：浅色 Same Black 20% · 深色 40%）。

### 10.2 Semantic Class — Glass Box

| Class | 组合要点 |
|-------|----------|
| `.glass-button-box` | `radius-xl` + `stroke-xs` / `stroke-base-quaternary` + overlay subtle→shallow + `effect-box` + `eds-shadow-box-subtle` + `eds-blur-glass` |
| `.glass-flotation-box` | overlay subtle→shallow + `eds-shadow-box-shallow` |
| `.glass-tabbar-box` | overlay subtle→shallow + `eds-shadow-box-deep` |
| `.glass-tabbar-bg` | overlay subtle→deep（70%） |
| `.glass-mask-box` | 无圆角/描边；overlay subtle→shallow + blur；底部分割 RN 用 `EgDivider` module（非 box-shadow） |

RN：`mobileTheme.glass.boxes[className].{light|dark}` 解析为 **layers + shadows + backdropBlur + viewStyle**；组件侧 `resolveGlassBoxComposition`（`@eds/mobile-components` → `atoms/glass`）。

---

## 11. GlassSurface preset（RN）

**Spec**：`spec/liquid-glass/surface.json`  
**RN**：`mobileTheme.glass.surface` · `resolveGlassVariant`（`GlassSurface` / `GlassControlShell`）。

---

## 12. Liquid Glass（玻璃材质栈）

**Spec**：`spec/liquid-glass/system.json`（架构真源，非 Figma 色板）  
**CSS**：`dist/css/liquid-glass/` — 编排说明 + Web ready hook  
**JS**：`@eds/mobile-tokens/liquid-glass` · renderer JSON `dist/json/liquid-glass/renderer.json`

**栈（摘要）**：

玻璃材质 = **effect token** + 平台分流：**iOS 26+ 完全原生**（`expo-glass-effect` · 系统控件）／**其他系统毛玻璃兜底**（blur + 叠层）→ 全部收在 **`packages/components` Glass 栈**，业务只认 **Eg* / GlassSurface**。

| 层 | 说明 |
|----|------|
| Token | `spec/effect` → `dist/css/effect`；RN：`spec/liquid-glass/surface.json` → `mobileTheme.glass.surface` |
| 毛玻璃兜底 | Android · iOS ≤25：expo-blur + token overlay gradient stops |
| iOS 26+ 原生 | 系统 Liquid Glass（材质 + 交互）；Web 另有 `attachLiquidGlass` |
| 公共 API | `GlassSurface` · `GlassControlShell` — 禁止业务侧平行 glass export |

```css
/* liquid-glass/ready.css */
[data-liquid-glass-ready] { /* JS initLiquidGlass() 注入 backdrop-filter */ }
```

---

## 13. Text Styles 独立入口

`text/styles.css` 与 `typography/semantic.css` 内 Text Style **class 重复**：

`.typography-display` · `.typography-headline` · `.typography-title` ·  
`.typography-body-{large,medium,small}` · `*-strong` · `.typography-footnote` · `.typography-bar`

均引用 `--eds-{role}-{size|weight|line-height}`。

---

## 14. 跨系统引用矩阵

| 消费方 | 引用的 token 来源 |
|--------|-------------------|
| `typography/semantic` | `--size-*`, `--weight-*` ← typography/base |
| `motion/recipe` | `--eds-motion-*`, `--eds-motion-ease-*` ← motion/base |
| `motion/semantic` | `--motion-recipe-*`, `--motion-scale-press`, `--motion-distance-sm` |
| `color/semantic` | `--eds-brand` 等 ← color/base |
| `color/tag/semantic` | `--eds-tag-*` ← color/tag/base |
| `effect/base` | `--eds-face`, `--blur-*`, `--depth-*` |
| `effect/semantic` | `--radius-*`, `--stroke-*`, `--effect-*`, `--eds-shadow-box-*`, `--eds-blur-glass` → `mobileTheme.glass.boxes` |
| `@eds/mobile-components` | `mobileTheme` ← 上述全部 spec |

**组件常用映射（Light）**

| 场景 | CSS token | 值 |
|------|-----------|-----|
| Input/Search 背景 | `--material-card-moderate` | `#0000000d` |
| 占位符 | `--text-base-tertiary` | `#00000066` |
| 正文 | `--text-base-primary` | `#000000` |
| Input/Search 背景 | `--material-card-moderate` | `#0000000a` |
| 占位符 | `--text-base-tertiary` | `#00000066` |
| 正文 | `--text-base-primary` | `#000000` |
| Brand 文案 | `--text-brand` | `#5f2243` |
| 光标 | `--material-brand` | `#5f2243` |
| Tap 反馈 | `--event-tap` | `#0000001a` |
| Input 高 xl | `--input-xl` | `56px` |
| Input 间距 | `--spacing-3` | `12px` |
| Body Medium | `--eds-body-medium-size` | `17px` |

---

## 15. RN mobileTheme 对照

```javascript
import mobileTheme from '@eds/mobile-tokens/theme';

mobileTheme.colors.light['material-card-moderate']  // "#0000000a"

组件内：`resolveGlassBoxComposition('glass-button-box', mode)` — 与 `.glass-button-box` CSS 同组合语义。

---

## 16. 8 位 Hex Alpha 速查

| 后缀 | Alpha | 示例 |
|------|-------|------|
| `00` | 0% | hide |
| `08` | ~3% | card-shallow |
| `0d` | ~5% | card-moderate、divider |
| `12` | ~7% | card-deep |
| `1a` | ~10% | event-tap |
| `1f` | ~12% | effect-moderate |
| `33` | 20% | quaternary |
| `66` | 40% | tertiary |
| `80` | 50% | same-black material |
| `99` | 60% | secondary |
| `cc` | 80% | effect-prompt |

---

*文档对应 `packages/tokens/dist/css` 构建产物。Token 变更后请 `pnpm build:tokens` 并核对 dist 与本文档。*
