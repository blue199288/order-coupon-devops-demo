# QoderWake × GitHub DevOps Demo

本仓库由 QoderWake 一键向导维护，默认用于演示一条容易观察的 AI DevOps 闭环，同时保留真实用户 EATP 流程。

推荐先阅读对外传播稿：[QoderWake × GitHub AI DevOps 最佳实践](docs/demo-flow-guide.md)。文档包含产品价值、完整研发故事、架构、工程原则和一键体验方式。

## 下载与首次运行

从正式交付目录或 GitHub Release 下载与 Mac 处理器匹配的文件，并同时下载 `SHA256SUMS`：

- Apple Silicon（M1/M2/M3/M4）：`QoderWake-GitHub-Demo-macOS-arm64.zip`
- Intel Mac：`QoderWake-GitHub-Demo-macOS-x64.zip`

使用 `uname -m` 判断架构：`arm64` 选择 Apple Silicon，`x86_64` 选择 Intel。下载后先校验：

```bash
shasum -a 256 -c SHA256SUMS
```

只有对应 ZIP 显示 `OK` 才继续。Apple Silicon 解压后运行：

```bash
chmod +x ./qw-github-demo-darwin-arm64
./qw-github-demo-darwin-arm64 launch
```

Intel Mac 将文件名换成 `qw-github-demo-darwin-x64`。

程序当前使用临时签名，尚未完成 Apple 公证，首次运行可能被 macOS Gatekeeper 或企业安全软件拦截。确认正式来源且 SHA256 校验通过后：

- macOS：先尝试运行一次，再进入“系统设置 → 隐私与安全性”，找到该程序并选择“仍要打开”。参考 [Apple 官方说明](https://support.apple.com/en-asia/guide/mac-help/-mh40616/mac)。
- 企业设备：将文件名、用途和 SHA256 提交给 IT/安全管理员，仅申请放行这个已校验文件。
- 不要关闭 Gatekeeper、杀毒软件或企业安全策略，也不要运行来源不明的绕过命令。

## 推荐演示链路

1. `Start QoderWake Demo` 创建 Milestone 和 `flow:demo` Requirement。
2. Release Waker 创建 `iteration/*`，并将 Requirement 置为 `status:ready-dev`。
3. Developer Waker 在 `demo/feature/*` 或 `demo/bugfix/*` 开发、测试并创建 PR。
4. PR 创建或代码 revision 更新触发 Reviewer Waker；评论、Review 和普通状态变化不会触发。
5. Reviewer 写入 `[QW-REVIEW][sha][PASS]` 后，由用户人工合并代码 PR。
6. 合并触发 Tester Waker。`fail-once` 路径会创建一次 Bug 并完成修复、复评审、复测；`pass` 路径直接通过。
7. 测试通过后 `Publish Demo Iteration` 唤醒 Release Waker创建发布 PR。
8. 用户合并发布 PR 后，Release Waker 打 Tag、创建 GitHub Release 并关闭 Milestone。

## 两条流程如何隔离

- Demo：`flow:demo`、`demo/*`、`QW_DEMO_*_WEBHOOK`、`demo-router.yml`。
- Real：`flow:real`、`type:batch` / `eatp:L*`、`QW_REAL_*_WEBHOOK`、`real-flow-router.yml`。
- `ci.yml` 是唯一共享组件，只负责代码质量门禁。

Qoder PAT 和 Waker API 地址只保存在 GitHub Actions Secrets。每次调用都在 Header 中携带 `Authorization: Bearer <PAT>`。
