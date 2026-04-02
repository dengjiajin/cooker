当前目标
- 保持第一期底座版文档基线清晰，准备进入后端底座实现

范围 / 暂不做
- 当前不再扩需求讨论，优先基于已确认的规格说明和实现计划推进开发
- 交易域能力仍只保留扩展位，不进入本期实现

当前状态
- 规格文档已完成并提交：`docs/superpowers/specs/2026-04-01-home-service-foundation-design.md`
- 实现计划已完成：`docs/superpowers/plans/2026-04-01-home-service-foundation-implementation.md`
- 项目规则已写入 `AGENTS.md`
- 任务记忆已建立：`.codex-memory/tasks/active/home-service-foundation/`
- 功能进度 JSON 已建立：`.codex-memory/tasks/active/home-service-foundation/feature_progress.json`
- 仓库已推送到远程 `origin/main`
- 后管 Web UI 原型已完成并通过构建校验

稳定约束
- 每次新 session 先读 `AGENTS.md`
- 需求基线以规格文档为准，任务执行以实现计划为准
- 长期决策以活动任务目录下的 `decisions.md` 为准
- 记忆类与规划类 Markdown 默认使用中文

关键参考
- `AGENTS.md`
- `docs/README.md`
- `docs/superpowers/specs/2026-04-01-home-service-foundation-design.md`
- `docs/superpowers/plans/2026-04-01-home-service-foundation-implementation.md`
- `.codex-memory/tasks/active/home-service-foundation/feature_progress.json`
- `.codex-memory/tasks/active/home-service-foundation/decisions.md`

风险 / 下一步
- 每次新会话先读 `AGENTS.md`、`current.md`、任务决策和 `feature_progress.json`，再继续推进
- 下一步进入后端底座实现，先补接口和数据层
