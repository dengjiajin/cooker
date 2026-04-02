当前目标
- 完成到家服务平台第一期底座版需求基线，并进入正式实现计划阶段

范围 / 暂不做
- 在实现计划写完之前，不直接开始业务编码
- 第一期只覆盖平台底座、后管 Web、客户端小程序入驻入口链路、厨师端登录承接

当前状态
- Git 仓库已初始化，当前分支为 `main`
- 项目级规则已补充到 `AGENTS.md`
- 底座版规格说明已写完并提交
- `find-skills` 已安装到本地，重启 Codex 后可直接使用
- 技术栈已确认：
  - 后端：`Spring Boot 3 + MyBatis-Plus + MySQL + Redis + Sa-Token`
  - 后管 Web：`Vue 3 + Vite + TypeScript + Element Plus + Pinia`
  - 小程序：原生微信小程序

稳定约束
- 每次新 session 先读 `AGENTS.md`，再按顺序读取 `.codex-memory/current.md`、`.codex-memory/spec/index.md`、活动任务记忆
- 项目长期按四个稳定域组织：用户域、服务者域、交易域、平台治理域
- 第一期硬规则：用户必须先完成微信登录和手机号授权，才能发起厨师入驻申请
- 厨师是用户扩展出的身份，但后管管理员登录仍是独立账号体系
- 后管使用标准 `sa-token + RBAC`；两个小程序端不使用 RBAC
- MySQL 表默认带 `creator`、`create_time`、`updater`、`update_time`
- 是否加逻辑删除字段需要按表逐个和用户确认
- 记忆类与规划类 Markdown 默认使用中文

关键参考
- `AGENTS.md`
- `docs/superpowers/specs/2026-04-01-home-service-foundation-design.md`
- `.codex-memory/tasks/index.md`

风险 / 下一步
- 下一步进入正式实现计划阶段
- 需要把规格说明继续拆成文件化计划，方便后续多 session 并行开发
