# 项目文档总览

## 长期保留文档

### 1. 项目规则

- `AGENTS.md`
- 用途：记录项目级规则、数据库约束、每次新 session 的读取顺序

### 2. 规格说明

- `docs/superpowers/specs/2026-04-01-home-service-foundation-design.md`
- 用途：作为第一期底座版需求基线
- 内容：领域划分、身份模型、RBAC、核心表、接口边界、页面边界、状态规则

### 3. 实现计划

- `docs/superpowers/plans/2026-04-01-home-service-foundation-implementation.md`
- 用途：作为后续开发与并行执行的任务拆分基线
- 内容：阶段任务、目录建议、并行拆分、验收标准

## 项目记忆文档

### 4. 当前记忆

- `.codex-memory/current.md`
- 用途：只保留当前阶段、下一步动作、关键引用
- 规则：保持简短，覆盖当前有效信息，不重复规格文档正文

### 5. 稳定规则索引

- `.codex-memory/spec/index.md`
- 用途：存放长期稳定、跨多 session 的规则索引

### 6. 活动任务索引

- `.codex-memory/tasks/index.md`
- 用途：列出当前正在推进的任务

### 7. 活动任务记忆

- `.codex-memory/tasks/active/home-service-foundation/brief.md`
- `.codex-memory/tasks/active/home-service-foundation/decisions.md`
- `.codex-memory/tasks/active/home-service-foundation/refs.md`
- `.codex-memory/tasks/active/home-service-foundation/feature_progress.json`
- 用途：
  - `brief.md`：任务目标与边界
  - `decisions.md`：当前任务已冻结的关键决策
  - `refs.md`：关键文档入口
  - `feature_progress.json`：本期功能点的布尔进度记录

## 执行型文档

### 8. 执行总计划

- `task_plan.md`
- 用途：跟踪开发阶段、当前阶段状态、后续执行顺序

### 9. 关键发现

- `findings.md`
- 用途：记录对实现有价值的结论，避免在对话中遗失

### 10. 进度日志

- `progress.md`
- 用途：记录已经完成的动作，便于跨 session 接力

## 使用顺序建议

新 session 启动时按这个顺序读取：

1. `AGENTS.md`
2. `.codex-memory/current.md`
3. `.codex-memory/spec/index.md`
4. `.codex-memory/tasks/index.md`
5. `.codex-memory/tasks/active/home-service-foundation/brief.md`
6. `.codex-memory/tasks/active/home-service-foundation/decisions.md`
7. `.codex-memory/tasks/active/home-service-foundation/feature_progress.json`
8. `docs/superpowers/specs/2026-04-01-home-service-foundation-design.md`
9. `docs/superpowers/plans/2026-04-01-home-service-foundation-implementation.md`

## 整理原则

- 需求只在规格文档里展开，不在 `current.md` 重复抄写
- 任务执行只在实现计划和 `task_plan.md` 里推进
- 长期决策集中放在任务 `decisions.md`
- `progress.md` 只记“做过什么”，不重复需求正文
