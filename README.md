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

**Showcase 启动 / 刷新（默认已优化）**

- 启动：只 ensure tokens；manifest / token watch startup 在产物已新时跳过；**勿**每次 `expo start -c`（`shift+r` 仅卡住时再清 Metro 缓存）。
- 真机联调：`components` / `animations` / showcase 源码 → **Fast Refresh**；改 `packages/tokens/spec` → watch 自动 `build:tokens` + 设备 reload。
- 刷新减负：dev 默认只载 4 个 EDS 正文字体（`showcaseDevFonts`）；需验 Mono / 全量字体：`EXPO_PUBLIC_SHOWCASE_FULL_FONTS=1 pnpm dev:showcase`。
- 其它：`EDS_SKIP_NATIVE_CHECK=1` 跳过 native 版本检查；`EDS_FORCE_CSS_MANIFEST=1` 强制重抽 token manifest。

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

## Consumer preview（Cregis）

业务 consumer [`work-cregis-mobile`](../work-cregis-mobile) 可配 **EAS Update · channel `preview`**（`eas.json` + `docs/eas-expo-go-preview.md`）。**本仓改动与 push 不会自动更新业务 App**；只有说 **「同步」** 才刷最新 EDS（`work.mdc` §5.2）。需要 OTA 时再在本仓 build 并在业务仓执行 update，例如：

```bash
pnpm build:mobile          # 本仓（业务同步前）
cd ../work-cregis-mobile
npm run preview:update     # 或 push 触发 Workflow — 由业务侧发起
```

本地联调（可选）：业务配 `metro.config.js`（见 [docs/consumer-linked-dev.md](docs/consumer-linked-dev.md)）；**仅联调时** EDS 跑 `EDS_CONSUMER_METRO_PORT=8081 pnpm watch:linked-consumers`。业务说 **「同步」** 时：`pnpm sync`（见 `work.mdc` §5）。
