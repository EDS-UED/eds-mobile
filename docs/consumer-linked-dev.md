# 业务联调：EDS 改动 → 业务 Metro 实时可见

**单向**：只改 `eds-mobile`；业务仓不改 EDS、不写回 `../eds-mobile`。

**默认**：本仓怎么改、是否 push，业务侧**都不会**因此自动更新；只有口令 **「同步」** 才按 `work.mdc` §5.2 刷最新设计系统（`pnpm sync` 等）。联调 watch 见下文，**不能**代替「同步」。**何时升级依赖与 preview 由业务决定。**

## 业务侧（配一次）

1. 依赖：`"@eds-evergreen/mobile": "file:../eds-mobile/packages/mobile"`
2. 复制 `docs/consumer-metro.config.example.cjs` → 业务根目录 `metro.config.js`
3. 日常：`expo start --port 8081`（保留现有 `prestart` / `ensure-eds-mobile` 即可）

组件 / 动画走 **源码 + Fast Refresh**；token 走下面 EDS 推送。

## EDS 侧（联调时开一个终端）

业务 Metro 已启动后：

```bash
EDS_CONSUMER_METRO_PORT=8081 pnpm watch:linked-consumers
```

- 只监听 `packages/tokens/spec` → `build:tokens` → 给业务 Metro **reload**
- **不**跑 `build:components` / assemble（避免占内存、死循环）

## iOS 26 · EgButtonGlass

- **iOS 26+**：`GlassView` + `isInteractive`（`readEgButtonGlassStackDiagnostics()` → `native`）。
- **其它**：RN `glass-button-box`（→ `rn`）。
- Consumer 须 `expo-glass-effect@~58`（canvas 原生路径）；系统 Nav 栏项同样用 **`EgButtonGlass`** + `unstable_header*Items` + `egNavBarNativeStackHeaderGlassItem`。

## 结束联调

终端 Ctrl+C，或：

```bash
pkill -f "watch-linked-consumers.mjs"
```

Showcase 预览用 `pnpm dev:showcase`（8080），与业务 8081 **不要同时开两个 watch**。

## 发布（非 Metro）

```bash
pnpm build:mobile   # eds-mobile
# 业务：preview:update / EAS
```
