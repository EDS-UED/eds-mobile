# eds-mobile — Agent 须知

本项目是 **EDS Mobile（React Native）**，与 [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop) **完全独立**。

## 协作方式（Agent 必读）

每个动作（读、搜、改、验）都要一两句带逻辑，小环节也要说；收尾两三句、简单明了，不复述、不啰嗦、不写五段式报告。详案：`.cursor/rules/work.mdc` §0.1。

## 硬约束

1. **只允许** `@eds/mobile-tokens`、`@eds/mobile-animations`、`@eds/mobile-components`、`@eds/mobile-patterns`、`@eds/mobile-workflows`（及 `@eds-evergreen/mobile` 发布包）。
2. **禁止**修改 `eds-desktop` 或其 consumer；**禁止** `@eds/desktop-*`。
3. **禁止** Web 组件 preview（已移除 rn-preview）；preview 只在 **showcase 原生**。
4. **202 个 Figma 组件**必须在 catalog；export / slug 由 `generate-catalog.mjs` 驱动。
5. **公共 API 不留 `@deprecated`**（§2）。
6. **场景组件** preset 在 `packages/components` 统一维护（§8）。
7. **`pnpm sync`** 仅更新 link 到 `eds-mobile` 的 consumer（§5）。
8. **无明确原生增强声明 → 一律 RN 栈**（token + RN `boxShadow` / blur / Reanimated 等同路径）；禁止默认 `Platform.OS` 双实现或 elevation/Skia 替 token 语义。详案：`.cursor/rules/work.mdc` **§6.0**。
9. 用户说 **「推送」** → `.cursor/rules/work.mdc` **§10**（§9 全绿 → 全量 commit → push；本仓无 GitHub Pages）。

## Preview

| 用途 | 入口 |
|------|------|
| EDS 组件（Live · Customize · Props · Inspect） | `pnpm dev:showcase` |

- **唯一 RN 实现**：`packages/components`
- **文档数据**：`apps/showcase/src/data/components/`（`rnDocRegistry`）
- 字体：Native `@eds/mobile-tokens/fonts-native` + `expo-font`；组件走 `edsFontStyle`
- 圆角：非胶囊必须 `theme.smoothRadius.*` / `edsSmoothRadius`（§4.2）；禁止裸 `borderRadius` 无 `borderCurve`
- 品牌色：走 token `--eds-brand` / `mobileTheme.colors.*['text-brand'|'event-focus-brand'|…]`；showcase 与 consumer 各自在 `color/base.json` 定义，禁止在组件或 doc UI 硬编码「品牌绿」hex

## 验证（改动后）

| 面 | 命令 |
|----|------|
| 组件 | `pnpm build:components` |
| 全量 npm 包 | `pnpm build:mobile` |
| Showcase | `pnpm --filter @eds/mobile-showcase typecheck` |
| 全仓 | `pnpm typecheck` |

## 目录（与 eds-desktop 对齐）

```
packages/{tokens,animations,components,patterns,workflows,mobile}
apps/showcase
```
