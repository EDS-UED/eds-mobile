# EDS Mobile

EverGreen Design System（**EDS**）— React Native 端。Figma 同步 token + 202 组件 catalog。**与 [EDS Desktop](https://github.com/EDS-UED/eds-desktop) 完全独立。**

| | |
|---|---|
| **GitHub** | [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) |
| **Figma** | [EDS Mobile](https://www.figma.com/design/LlB2jT8KdxM6taf5wOSAEM/EverGreen-Design-System--Mobile-) |
| **npm** | [`@eds-evergreen/mobile`](https://www.npmjs.com/package/@eds-evergreen/mobile) |
| **规范** | `.cursor/rules/work.mdc` · `AGENTS.md` |

## Requirements

- Node.js 20+
- pnpm 9+

## Quick start

```bash
pnpm install
pnpm build:tokens
pnpm dev                # Showcase → Expo · 模拟器 / 真机
pnpm dev:showcase
```

## Project structure

Monorepo 目录与 `eds-desktop` 对齐：

```
eds-mobile/
├── packages/
│   ├── mobile/              @eds-evergreen/mobile — **唯一对外发布的 npm 总包**
│   ├── tokens/              @eds/mobile-tokens
│   ├── animations/          @eds/mobile-animations
│   ├── components/          @eds/mobile-components — 202 Eg*
│   ├── patterns/            @eds/mobile-patterns（持续扩展）
│   └── workflows/           @eds/mobile-workflows（持续扩展）
├── apps/
│   └── showcase/            Native Showcase（Expo）— 与 desktop apps/showcase 同构
└── figma.config.json
```

### `apps/showcase/src/`（与 desktop showcase 同构）

```
src/
├── data/           # 导航、组件文档 registry、tokens/animations 数据
├── views/          # tokens · components · animations · patterns · workflows · scenes
├── navigation/     # React Navigation（对应 desktop router/）
├── hooks/          # 对应 desktop composables/
├── lib/
└── layout/         # 壳层（持续扩展）
```

## Figma sync

```bash
node packages/tokens/scripts/import-mobile-figma.mjs
pnpm build:tokens
node packages/components/scripts/generate-catalog.mjs
```

## Consumer usage

```bash
pnpm add @eds-evergreen/mobile
```

```ts
import { EgButtonBrand, mobileTheme } from '@eds-evergreen/mobile';
import { mobileMotion } from '@eds-evergreen/mobile/animations';
```

## Build & publish

```bash
pnpm build:mobile
pnpm publish:mobile
```
