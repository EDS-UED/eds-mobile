# EDS Mobile

EverGreen Design System — React Native 端。Figma 同步 token + 202 组件 catalog。**与 [eds-desktop](https://github.com/theyangsong/eds-desktop) 完全独立。**

| | |
|---|---|
| **Figma** | [EDS Mobile](https://www.figma.com/design/LlB2jT8KdxM6taf5wOSAEM/EverGreen-Design-System--Mobile-) |
| **npm** | `@eds-evergreen/mobile` |
| **规范** | `.cursor/rules/work.mdc` · `AGENTS.md` |

## Quick start

```bash
pnpm install
pnpm build:tokens
pnpm dev                # Showcase → http://localhost:5178
```

## Structure

```
eds-mobile/
├── packages/
│   ├── tokens/          @eds/mobile-tokens — Figma → CSS + RN theme
│   ├── components/      @eds/mobile-components — 202 RN components (Figma 1:1)
│   ├── mobile-animations/  iOS-native Reanimated presets
│   └── mobile/          @eds-evergreen/mobile — unified npm package
├── apps/showcase/       Web Showcase (Tokens · Animations · Components · Patterns · Workflows)
└── figma.config.json    Mobile Figma fileKey LlB2jT8KdxM6taf5wOSAEM
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

- This repo never modifies `~/Projects/eds-desktop`
- `pnpm sync` only discovers consumers linking `@eds/mobile-*` or `@eds-evergreen/mobile`

## License

MIT
