# QoderWake × GitHub DevOps Demo

本仓库由 QoderWake 一键向导维护，用于演示一条容易观察、可重复运行的 AI DevOps 研发闭环。

推荐先阅读对外传播稿：[QoderWake × GitHub AI DevOps 最佳实践](docs/demo-flow-guide.md)。文档包含产品价值、完整研发故事、架构、工程原则和一键体验方式。

## 推荐演示链路

1. `Start QoderWake Demo` 创建 Milestone 和 `flow:demo` Requirement。
2. Release Waker 创建 `iteration/*`，并将 Requirement 置为 `status:ready-dev`。
3. Developer Waker 推荐在 `demo/feature/*` 或 `demo/bugfix/*` 开发、测试并创建 PR；Router 以 PR 中的 `Flow: demo` 与 `[QW-DEMO][DEV][READY]` 作为权威交付标记。
4. PR 创建或代码 revision 更新触发 Reviewer Waker；评论、Review 和普通状态变化不会触发。
5. Reviewer 写入 `[QW-REVIEW][sha][PASS]` 后，由用户人工合并代码 PR。
6. 合并触发 Tester Waker。`fail-once` 路径会创建一次 Bug 并完成修复、复评审、复测；`pass` 路径直接通过。
7. 测试通过后 `Publish Demo Iteration` 唤醒 Release Waker创建发布 PR。
8. 用户合并发布 PR 后，Release Waker 打 Tag、创建 GitHub Release 并关闭 Milestone。

## 自动化边界

- GitHub Issue、Milestone、PR、CI 和 Release 是研发事实源。
- `demo-router.yml` 只转发 `flow:demo` Issue 与带权威交付标记的代码 PR。
- 四个 Waker 使用相互独立的 API 自动任务和 `QW_DEMO_*_WEBHOOK` Secret。
- `ci.yml` 只负责代码质量门禁；代码合并与正式发布合并由用户确认。

Qoder PAT 和 Waker API 地址只保存在 GitHub Actions Secrets。每次调用都在 Header 中携带 `Authorization: Bearer <PAT>`。
