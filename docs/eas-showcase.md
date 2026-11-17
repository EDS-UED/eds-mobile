# EDS Mobile · EAS Build（Showcase）

日常 **Expo Go 预览** 走 **EAS Update**，见 [`eas-expo-go-preview.md`](./eas-expo-go-preview.md)。

本文：**EAS Build** — 在 [expo.dev](https://expo.dev) 上打 **原生安装包**（Dev Client / 内测 / 上架）。

## 前置

1. [Expo 账号](https://expo.dev/signup)
2. 本机：`npx eas-cli@latest login`

## 首次关联项目

在仓库根目录：

```bash
pnpm eas:init
```

按提示创建或关联 EAS 项目：**显示名 EDS Mobile** · **slug `eds-ued`**（`app.json` 已写；slug 与 `projectId` 绑定，改 slug 须 `eas init --force` 新建/重链项目）。

## 构建

```bash
# 内测 iOS
pnpm eas:build:ios

# 内测 Android
pnpm eas:build:android

# 或在 showcase 目录指定 profile
cd apps/showcase && npx eas-cli@latest build --profile production
```

| Profile | 用途 |
|---------|------|
| `development` | Dev Client · 模拟器（需 `expo-dev-client`） |
| `preview` | 内部分发（默认脚本） |
| `production` | 商店 / 正式版 · `autoIncrement` |

## Monorepo

- `eas.json` · `apps/showcase/eas.json`
- `apps/showcase` → `eas-build-pre-install`：仅复制根 `pnpm-lock.yaml` / `.npmrc`（勿复制 `pnpm-workspace.yaml`）
- `apps/showcase` → `eas-build-post-install`：云端装完依赖后 `build:tokens` + CSS manifest
- 发构建前请保持 **`pnpm-lock.yaml` 与 `package.json` 一致**（EAS 默认 `frozen-lockfile`，锁文件过期会在 Install 阶段失败）