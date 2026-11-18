# EDS Mobile · EAS Update + Expo Go 远程预览

目标：维护者 **push** 或手动发 OTA 后，同事用 **Expo Go（SDK 58）** 打开 [@theyangsongs-team/eds-ued](https://expo.dev/accounts/theyangsongs-team/projects/eds-ued)（**EDS Mobile**）**preview** 渠道看最新 Showcase JS——**不必**装自定义 Dev Client、不必同网。

与 **Cregis UED** 流程一致，区别：DS 就在本 monorepo，云端 **不需要** clone `eds-mobile` / `GITHUB_PAT`。

## 架构

```text
push main → EAS Workflow (eas update) → Expo CDN · channel preview
同事：expo.dev → Updates → Preview 二维码 → Expo Go
```

| 路径 | 用途 |
|------|------|
| **EAS Update（本文）** | 日常 JS 预览 · Expo Go |
| **EAS Build** | 原生包 / 真机玻璃等 Expo Go 不支持的能力 · 见 [`eas-showcase.md`](./eas-showcase.md) |

## 一次性（维护者）

1. `npx eas-cli login`
2. `app.json` 已含 `projectId`、`updates.url`、`runtimeVersion: "exposdk:58.0.0"`（有 `ios/` 的 bare 须写死，不能用 policy）
3. Dashboard → **GitHub** → 连 **EDS-UED/eds-mobile**（或实际远程名）→ 开 **Workflows**
4. 无 `GITHUB_PAT`（相对 Cregis 可省整节）

**组织**：`@theyangsongs-team/eds-ued`（显示名 **EDS Mobile**）· projectId `3169730a-d20a-4883-9bc2-244e1145e4e4`。误建在个人名下的 `theyangsong/*` 项目请 Dashboard 归档。

## 发布

### 自动（推荐）

推 **main** → `.eas/workflows/publish-preview-update.yml` → channel **`preview`**。

```bash
npx eas-cli workflow:runs --limit 3
npx eas-cli workflow:status <runId>
```

### 手动（兜底）

```bash
pnpm preview:update
# = build:mobile（tokens + 组件 dist）+ eas update --channel preview --auto
```

或：

```bash
npx eas-cli update --channel preview --environment preview \
  --message "说明" --non-interactive
```

（须在 `apps/showcase` 或带正确 project 上下文。）

## 同事怎么用

1. 安装 **Expo Go**（版本对齐 **SDK 58**）。
2. 首次： [Deployments / Updates](https://expo.dev/accounts/theyangsongs-team/projects/eds-ued/deployments) → **Preview** 二维码。
3. 之后：Expo Go **最近项目** → **EDS Mobile**；有新 Update 时重进 / Reload。

## Monorepo · 云端 install

- **Workflow** `.eas/workflows/publish-preview-update.yml`：`defaults.image: sdk-58` + `tools.node: 22.11.0` + `corepack: true`（满足根 `engines` · node≥20 · pnpm≥9；默认 runner 为 Node 18 / pnpm 8 会 `ERR_PNPM_UNSUPPORTED_ENGINE`）
- `after_install_node_modules`：`pnpm build:tokens` + CSS manifest（与 `eas-build-post-install` 对齐）
- **`pnpm-lock.yaml` 必须与 `package.json` 一致**（EAS 默认 frozen-lockfile）
- 勿把 `pnpm-workspace.yaml` 复制进 `apps/showcase`（会误判 workspace 根）

## Expo Go 限制（Showcase）

液态玻璃、`expo-glass-effect`、部分原生实验在 **Expo Go** 里可能仍是 RN 兜底或不可用；要看完整原生效果请用 **EAS Build** Dev Client / 内测包，而非仅靠 OTA。

## 口令

| 口令 | 含义 |
|------|------|
| **同步** | 刷本地 link consumer，**不是** EAS |
| **推送** | Git push；若要同事 Expo Go 立刻跟版，确认 Workflow **SUCCESS** 或跑 `pnpm preview:update` |