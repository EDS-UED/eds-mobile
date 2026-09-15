# EDS Mobile Showcase

**EDS Mobile** 的 **Vue 过渡文档壳**：token 画廊、组件 catalog IA、Motion 三层文档（Base → Recipe → Semantic）。

> **RN live preview 真源**是 `apps/playground`（Expo），不是本 Showcase。

## 依赖

| 角色 | 包 |
|------|-----|
| Token | `@eds/mobile-tokens` |
| Motion | `@eds/mobile-animations` |
| 组件 catalog | `@eds/mobile-components`（文档引用；preview stub 在 `src/stubs/`） |

## 启动

```bash
pnpm install
pnpm dev:showcase
```

| 环境 | 地址 |
|------|------|
| 本地 | http://localhost:5178/ |
| GitHub Pages | https://eds-ued.github.io/eds-mobile/ |

## 路由

| 路径 | 内容 |
|------|------|
| `/tokens` | Color / Scale / Typography / Motion tokens |
| `/animations/:slug` | Motion 三层（Base → Recipe → Semantic）+ RN composition 示例 |
| `/components/:slug` | 组件文档（Web stub preview） |
