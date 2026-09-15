# EDS Mobile

EverGreen Design System（**EDS**）— React Native 端。Figma 同步 token + 202 组件 catalog。**与 [EDS Desktop](https://github.com/EDS-UED/eds-desktop) 完全独立。**

| | |
|---|---|
| **GitHub** | [EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile) |
| **Live Showcase** | https://eds-ued.github.io/eds-mobile/ |
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
pnpm dev:playground     # RN preview — Expo · 模拟器 / 真机扫码
pnpm dev:showcase       # Web 文档（Vue 过渡）→ http://localhost:5178
```

## Structure

```
eds-mobile/
├── packages/
│   ├── tokens/             @eds/mobile-tokens — Figma → CSS + RN theme
│   ├── components/         @eds/mobile-components — 202 RN components (Figma 1:1)
│   ├── mobile-animations/  @eds/mobile-animations — Motion presets (Reanimated)
│   └── mobile/             @eds-evergreen/mobile — unified npm package
├── apps/playground/        RN Playground — component live preview（Expo · 真源）
├── apps/showcase/          Web 文档壳（Vue · 过渡）— Tokens · Animations · Components…
└── figma.config.json       Mobile Figma fileKey LlB2jT8KdxM6taf5wOSAEM
```

## Figma sync

```bash
# After updating variables in Mobile Figma (Dev Mode):
node packages/tokens/scripts/import-mobile-figma.mjs
pnpm build:tokens
node packages/components/scripts/generate-catalog.mjs  # if components changed
```

## Consumer usage

```bash
pnpm add @eds-evergreen/mobile react react-native react-native-svg react-native-reanimated
```

```ts
import { mobileTheme, EgBrandButton } from '@eds-evergreen/mobile';
import { getThemeColors } from '@eds-evergreen/mobile/components';
```

## Isolation guarantee

- This repo never modifies [EDS-UED/eds-desktop](https://github.com/EDS-UED/eds-desktop)
- `pnpm sync` only discovers consumers linking `@eds/mobile-*` or `@eds-evergreen/mobile`

## License

MIT
