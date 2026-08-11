# QoderWake × GitHub DevOps Demo

本仓库由 QoderWake 一键向导维护，默认用于演示一条容易观察的 AI DevOps 闭环，同时保留真实用户 EATP 流程。

配套架构图和逐步操作见 [Demo 流程演示说明](docs/demo-flow-guide.md)。

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
