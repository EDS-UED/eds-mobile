# EDS Mobile Preview 架构

> **2026-09-20** — Web preview（Vue showcase / rn-preview）已移除。EDS 在电脑上只做 packages 开发与构建；**全部 preview 在 `apps/showcase`（模拟器/真机）**。

## 入口

EDS 组件 preview：**`pnpm dev:showcase`**（模拟器 / 真机 · Metro **8080**）。

| 项目 | 场景 | 端口 |
|------|------|------|
| **eds-mobile** showcase | 真机 / 模拟器 | **8080** |
| **work-cregis-mobile** | 真机 / 模拟器 | **8081** |
| **work-cregis-mobile** | 浏览器预览 | **8082** |

## showcase 能力

- Live preview — `createCatalogPreviewProps` + Customize merge
- Customize / Props / snippet — `apps/showcase/src/data/components/`
- Inspect — Preview/Inspect 模式 · `onLayout` 实测 · BottomSheet

## 包

- `@eds/mobile-components` — Eg* 真源
- `@eds/mobile-animations` — motion preset

## 已删除（Web）

- 原 `apps/showcase`（Vue · 旧 Mobile Web）
- 原 `apps/rn-preview`（RN-Web）
- `scripts/parity/collect-web.mjs` · `diff.mjs`
- `.github/workflows/deploy-pages.yml`（eds-mobile Web Pages）
