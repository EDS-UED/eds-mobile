# EDS Mobile — Git 访问与协作

> 仓库：[EDS-UED/eds-mobile](https://github.com/EDS-UED/eds-mobile)  
> Agent 真源：`.cursor/rules/work.mdc`（改代码、§5 同步、§10 推送）  
> 业务仓三分支流程见：[work-cregis-mobile · git-branch-workflow.md](https://github.com/EDS-UED/work-cregis-mobile/blob/main/docs/git-branch-workflow.md)

---

## 1. 设计原则

| 角色 | Git 权限 | 对 EDS 源码 |
|------|----------|-------------|
| **维护者**（`theyangsong`） | **写**：commit / push `main`、Ruleset bypass | 在本仓改 token、组件、Showcase；**推送**走 §10 |
| **其他协作者 / 业务开发**（如 `lulujj123`） | **只读**：clone、pull、`fetch` | **禁止**向本仓 push、改分支、删仓库；需要新能力 → 提需求，由维护者改 EDS |
| **未加协作者的 GitHub 用户** | **公开读**（仓库 public） | 可 clone / 看代码；**无** push |

**与业务仓分工**

- **eds-mobile**：设计系统唯一真源；默认 **单分支 `main`** 集成。
- **work-cregis-mobile**：业务 App；`jojo` / `yang` / `main` 三分支（见业务仓文档）。
- 业务开发在 **业务仓** 写 Scene；吃到新 Eg* **不靠**自己 push EDS，而是维护者推 EDS 后，在业务仓说 **「同步」**（`ensure-eds-mobile` / `file:` dist）。

---

## 2. GitHub 权限（当前配置）

仓库为 **Public**。写保护靠 **Collaborator 角色 + Rulesets** 叠加。

### Collaborators

| 用户 | 角色 | 能做什么 |
|------|------|----------|
| **theyangsong** | Admin | 推 `main`、改 Settings / Rules |
| **lulujj123** | **Read** | clone / pull；**不能** push、不能改设置 |

新同事默认：**Read**（或仅依赖 public clone，不设写权限）。  
设置：[Settings → Collaborators](https://github.com/EDS-UED/eds-mobile/settings/access)

### Ruleset：`main`

[规则 27710775](https://github.com/EDS-UED/eds-mobile/rules/27710775)

| 规则 | 说明 |
|------|------|
| 禁删分支 | 任何人不能删 `main`（无 bypass 时） |
| 禁 force push | 不能 `git push --force` |
| 禁直 push / update | 无 bypass 者 **不能** `git push origin main` |
| **Bypass** | 仅 **`theyangsong`** |

即使误设为 Write 协作者，Ruleset 仍会挡掉对 `main` 的 push（维护者除外）。

---

## 3. 其他人如何「同步」EDS（只读）

这里的 **同步** = 把 **已发布在 GitHub `main` 上的 EDS** 拉到本机用于开发 / 构建，**不是**改 EDS 仓库。

### 方式 A：业务仓 `work-cregis-mobile`（推荐）

在业务项目根目录：

```bash
node scripts/ensure-eds-mobile.mjs   # 按 lock / 脚本 clone 或 pull ../eds-mobile
npm install                         # file:../eds-mobile/packages/mobile
```

或对 Cursor 说 **「同步」**（按业务 `work.md` §3.1.2）。

### 方式 B：单独 clone EDS（只读开发、看 Showcase）

```bash
git clone https://github.com/EDS-UED/eds-mobile.git
cd eds-mobile
git pull origin main
pnpm install
pnpm build:mobile          # 需要 dist 时
pnpm dev:playground        # 本地 preview（维护者 / 有读权限者均可）
```

**禁止**：在 clone 里改完往 `origin` push（会 403 / 被 Ruleset 拒绝）。

### 方式 C：EAS / 云端

业务 App 的 EAS Workflow 从 GitHub **clone `eds-mobile@main` + `pnpm build:mobile`**，无需协作者写权限。

---

## 4. 维护者推送（唯一写入路径）

仅 **theyangsong**（或今后显式加入 bypass 的维护者）：

1. §9 验证通过  
2. `main` 上 commit  
3. `git push origin main`  
4. 等 EAS Showcase **preview** SUCCESS（§10）

与业务仓联推时：**先 eds-mobile `main`，后 work-cregis-mobile `main`**。

---

## 5. 禁止与例外

| 行为 | 其他人 | 维护者 |
|------|--------|--------|
| clone / pull | ✅ | ✅ |
| 本地改代码做实验 | ✅（本地） | ✅ |
| push 到 `EDS-UED/eds-mobile` | ❌ | ✅ |
| 开 PR 进本仓（Fork） | ⚠️ 不推荐；默认 **不收** 外部 PR 改 DS，走需求 → 维护者改 | 可自审自合 |
| 删仓库 / 改 Rules | ❌ | ✅（Admin） |
| 代替维护者 **「推送」** EDS | ❌ | — |

需要组件 / token 变更：在业务仓或沟通渠道提需求 → 维护者在 **eds-mobile** 改 → **推送** EDS → 业务侧 **「同步」**。

---

## 6. 新人 checklist

- [ ] 确认 GitHub 上对 **eds-mobile** 仅为 **Read**（或不用协作者、只 public clone）  
- [ ] 业务开发只在 **work-cregis-mobile** 的 **`jojo` / `yang`** 上提交  
- [ ] 要用新 Eg*：等维护者推 EDS，再在业务仓 **「同步」**  
- [ ] 不要配置 `git remote` 写 token 指向 eds-mobile 做日常 push  

---

## 7. 修订记录

| 日期 | 说明 |
|------|------|
| 2026-11-20 | 初版：只读协作者、`main` Ruleset、同步 vs 推送分工 |