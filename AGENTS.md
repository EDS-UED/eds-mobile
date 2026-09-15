# eds-mobile — Agent 须知

本项目是 **EDS Mobile（React Native）**，与 [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop) **完全独立**。

## 协作方式（Agent 必读）

每个动作（读、搜、改、验）都要一两句带逻辑，小环节也要说；收尾两三句、简单明了，不复述、不啰嗦、不写五段式报告。详案：`.cursor/rules/work.mdc` §0.1 = Desktop `work.mdc` §0.1。

## 硬约束

1. **只允许** `@eds/mobile-tokens`、`@eds/mobile-animations`、`@eds/mobile-components`（及 `@eds-evergreen/mobile` 发布包）。
2. **禁止**修改 `eds-desktop` 或其 consumer；**禁止** `@eds/desktop-*`。
3. **202 个 Figma 组件**必须在 catalog；export / slug / showcase 由 `generate-catalog.mjs` 驱动，禁止手工分叉。
4. **公共 API 不留 `@deprecated`**（§2）— 废弃即当轮删干净。
5. **场景组件**（`EgCregisTabBar`、`EgNotesPopover` 等）preset 在 `packages/components` 统一维护；consumer 禁止手搓平行实现（§8）。
6. **`pnpm sync`** 仅更新 link 到 `eds-mobile` 的 consumer；步骤见 `work.mdc` §5。

## Preview

- **RN 真源**：`apps/playground`（Expo）— 模拟器 / 真机预览 `@eds/mobile-components`
- **Web 过渡**：`apps/showcase`（Vue）— token / 文档 IA；**不是** RN 运行时

## 验证（改动后）

| 面 | 命令 |
|----|------|
| 组件 | `pnpm build:components` |
| 全量 npm 包 | `pnpm build:mobile` |
| Playground | `pnpm --filter @eds/mobile-playground typecheck` |
| Showcase | `pnpm --filter @eds/mobile-showcase build` |

## 文件索引

- `.cursor/rules/work.mdc` — **唯一规范**（命名 §3、Desktop 对照 §7、验证 §9）
- `packages/components/scripts/generate-catalog.mjs` — catalog + RN scaffold 生成器
- `packages/components/src/catalog/figmaCatalog.ts` — 202 组件真源
- `../eds-desktop/.cursor/rules/work.mdc` — Desktop 约定（只读参照，勿改）
