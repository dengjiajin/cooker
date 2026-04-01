# 到家服务平台第一期底座版需求规格说明

## 1. 文档目标

本规格说明用于定义到家服务平台第一期的底座能力、系统边界、数据模型、接口边界与开发顺序。

第一期目标不是直接交付完整业务平台，而是优先完成稳定的基础底座，为后续扩展以下能力提供可持续的结构基础：

- 厨师上门
- 精选套餐
- 保洁到家
- 微信支付
- 钱包
- 开票
- 售后
- 客服扩展

本期主线是：平台用户微信登录 -> 用户发起厨师入驻申请 -> 后台审批 -> 生成正式厨师身份 -> 厨师端登录与首次改密。

## 2. 第一期范围

### 2.1 本期必须完成

- 后端基础工程与公共能力
- MySQL 核心表设计与落地
- 后管管理员登录
- `sa-token` 会话控制
- 标准 RBAC 权限体系
- 文件上传能力
- 后管用户列表
- 后管厨师列表
- 后管入驻审批
- 后管个人中心
- 后管修改密码
- 客户端微信登录与手机号授权
- 客户端“我的 -> 入驻申请”
- 客户端申请状态、驳回原因、历史时间线
- 厨师端手机号密码登录
- 厨师端首次登录强制改密
- 厨师端个人中心与基础状态查看

### 2.2 本期明确不做

- 厨师上门下单
- 精选套餐交易
- 保洁到家业务
- 钱包业务功能
- 微信支付接入
- 提现
- 发票申请流程
- 售后流程
- 客服 IM 会话能力

### 2.3 本期仅预留设计位

- 交易域能力
- 钱包与账务能力
- 开票能力
- 协议管理能力
- 客服消息扩展能力

## 3. 系统域划分

项目按稳定业务能力划分为 4 个核心域。

### 3.1 用户域

负责平台自然人主体能力：

- 微信登录
- 手机号授权
- 用户入库
- 用户资料维护
- 用户状态控制

### 3.2 服务者域

负责服务提供者能力，第一期只落厨师：

- 厨师入驻申请
- 入驻审批
- 驳回重提
- 正式厨师身份
- 厨师端登录
- 首次改密
- 厨师状态控制

后续保洁、月嫂等服务者应继续归入该域，通过服务者类型扩展。

### 3.3 交易域

负责平台交易与资金流转能力，第一期仅预留边界：

- 上门服务订单
- 精选套餐
- 预约
- 微信支付
- 钱包
- 提现
- 退款售后
- 评价
- 开票

### 3.4 平台治理域

负责平台治理与配置能力：

- 后管管理员
- RBAC
- 菜单权限
- 用户列表
- 厨师列表
- 入驻审批管理
- 协议管理
- 客服消息管理
- 日志审计
- 平台配置

## 4. 全局业务规则

- 所有人必须先在客户端通过微信登录并完成手机号授权，才成为平台用户。
- 用户微信登录成功后立即进入用户表，并在后管用户列表可见。
- 厨师不是脱离用户主体独立存在的人，厨师是用户扩展出的服务者身份。
- 用户只有在成为平台用户后，才能发起厨师入驻申请。
- 厨师表中的每条记录都必须能够回溯到用户表中的同一个用户。
- 审批通过后，用户才进入后管厨师列表。
- 厨师端登录手机号必须与用户体系中的手机号一致。
- 厨师默认密码固定为 `666666`。
- 默认密码只作为初始化口令使用，数据库不得保存明文。
- 厨师首次登录后必须强制修改密码。
- 普通用户和厨师默认不能登录后管。
- 后管只有管理员可登录；若某人需要进入后管，必须单独进入管理员体系。
- RBAC 仅作用于后管，不作用于客户端和厨师端小程序。
- 入驻申请入口位于客户端“我的”页面内，不单独占用 Tab。

## 5. 账号与身份模型

### 5.1 主体关系

系统包含以下 3 类主体：

- 平台用户
- 正式厨师
- 后管管理员

其中：

- 平台用户是自然人主体
- 正式厨师是平台用户扩展出的服务者身份
- 后管管理员是独立登录主体

### 5.2 用户与厨师关系

- 用户是厨师的前置身份
- 用户与厨师是一对零或一关系
- 一个用户最多对应一个正式厨师身份
- 厨师申请是流程数据，不是正式厨师身份本身

### 5.3 后管管理员关系

- 管理员不复用用户表
- 管理员不复用厨师表
- 管理员权限仅来源于管理员体系与 RBAC

## 6. 后管权限模型

第一期后管采用标准 RBAC 做法，不做删减版。

### 6.1 目标能力

- 管理员登录
- 角色管理
- 菜单管理
- 管理员与角色关联
- 角色与菜单关联
- 菜单级权限控制
- 按钮级权限控制

### 6.2 第一阶段落地方式

- 底层按完整 RBAC 建设
- 第一阶段允许只有少量管理员角色在实际使用
- 即使当前角色简单，也不删减 RBAC 表结构和鉴权逻辑

## 7. 页面边界

### 7.1 后管页面

- 登录页
- 首页
- 用户列表
- 用户详情
- 厨师列表
- 厨师详情
- 入驻审批列表
- 入驻申请详情
- 权限管理
- 个人中心
- 修改密码

说明：

- 用户列表支持查看、修改、启用、禁用
- 厨师列表支持查看、修改、启用、禁用
- 后台不提供手工新增用户功能
- 后台不提供手工新增厨师功能
- 用户新增只能来自客户端微信登录
- 厨师新增只能来自入驻申请审批通过

### 7.2 客户端小程序页面

- 微信登录与手机号授权流程
- 我的页面
- 入驻申请入口
- 入驻申请表单页
- 申请详情与状态页

客户端第一期不扩展订单、套餐、钱包、发票等业务页面。

### 7.3 厨师端小程序页面

- 登录页
- 首次改密页
- 个人中心
- 身份状态查看页

## 8. 核心流程

### 8.1 用户登录流程

1. 用户在客户端发起微信登录
2. 用户完成手机号授权
3. 系统写入或更新用户表
4. 用户进入后管用户列表

### 8.2 入驻申请流程

1. 用户进入客户端“我的”
2. 点击“入驻申请”
3. 填写申请资料并上传附件
4. 提交后进入 `pending`
5. 后台管理员审批

### 8.3 驳回重提流程

1. 管理员驳回申请并填写原因
2. 客户端展示驳回原因与历史时间线
3. 用户在原申请上修改资料
4. 重新提交后状态回到 `pending`

### 8.4 审批通过流程

1. 管理员审批通过
2. 系统将申请沉淀为正式厨师身份
3. 系统初始化默认密码 `666666`
4. 后管厨师列表出现该厨师
5. 管理员线下通知初始密码
6. 厨师用手机号和初始密码登录厨师端
7. 厨师首次登录强制修改密码

## 9. 申请资料规则

### 9.1 必填字段

- 手机号
- 姓名
- 身份证

### 9.2 选填字段

- 性别
- 本人照片
- 厨师证
- 所在城市
- 擅长菜系
- 从业年限
- 个人简介

### 9.3 本期不采集

- 健康证
- 紧急联系人

### 9.4 审核动作

后台审批必须支持：

- 通过
- 驳回
- 驳回原因填写
- 查看申请历史

## 10. 数据模型草案

### 10.1 `user`

平台用户主表，承载所有客户端微信登录用户。

建议核心字段：

- `id`
- `openid`
- `unionid`
- `mobile`
- `nickname`
- `avatar`
- `status`
- `last_login_time`
- `creator`
- `create_time`
- `updater`
- `update_time`

### 10.2 `chef_apply`

厨师入驻申请主表，承载流程数据与申请快照。

建议核心字段：

- `id`
- `user_id`
- `mobile`
- `name`
- `id_card_no`
- `gender`
- `photo_file_id`
- `chef_cert_file_id`
- `city_name`
- `cuisine_tags`
- `work_years`
- `intro`
- `status`
- `reject_reason`
- `submitted_time`
- `review_time`
- `review_admin_id`
- `creator`
- `create_time`
- `updater`
- `update_time`

### 10.3 `chef_apply_history`

厨师申请历史表，用于客户端时间线展示与后台审计。

建议核心字段：

- `id`
- `apply_id`
- `action`
- `from_status`
- `to_status`
- `remark`
- `operator_type`
- `operator_id`
- `snapshot_json`
- `creator`
- `create_time`
- `updater`
- `update_time`

### 10.4 `chef`

正式厨师表，第一期合并正式厨师资料与厨师登录认证字段。

建议核心字段：

- `id`
- `user_id`
- `apply_id`
- `mobile`
- `password_hash`
- `password_salt`
- `password_changed`
- `name`
- `id_card_no`
- `gender`
- `photo_file_id`
- `chef_cert_file_id`
- `city_name`
- `cuisine_tags`
- `work_years`
- `intro`
- `status`
- `last_login_time`
- `creator`
- `create_time`
- `updater`
- `update_time`

### 10.5 `admin_user`

后管管理员主表。

建议核心字段：

- `id`
- `mobile`
- `password_hash`
- `password_salt`
- `name`
- `status`
- `last_login_time`
- `creator`
- `create_time`
- `updater`
- `update_time`

### 10.6 RBAC 基础表

- `admin_role`
- `admin_menu`
- `admin_user_role`
- `admin_role_menu`

### 10.7 通用基础表

- `sys_file`
- `sys_operation_log`
- `sys_login_log`

## 11. 状态字段与删除策略

### 11.1 状态字段

- `user.status`: `enabled` / `disabled`
- `chef_apply.status`: `pending` / `rejected` / `approved`
- `chef.status`: `enabled` / `disabled`
- `admin_user.status`: `enabled` / `disabled`

说明：

- 账户可用状态与审核流程状态必须分离
- 禁用/启用语义不得与审批流状态混用

### 11.2 状态效果

- 用户禁用：完全禁止客户端登录，同时禁止发起新的入驻申请
- 厨师禁用：禁止厨师端登录，不影响其作为普通用户使用客户端
- 管理员禁用：禁止登录后管

### 11.3 删除策略

以下主业务表默认不删，以状态管理和历史保留为主：

- `user`
- `chef_apply`
- `chef_apply_history`
- `chef`
- `admin_user`
- `sys_operation_log`
- `sys_login_log`

RBAC 关联表允许物理删除：

- `admin_user_role`
- `admin_role_menu`

是否引入逻辑删除字段如 `is_del`，需按具体表与业务场景单独确认，不全局默认引入。

## 12. 枚举与约束

### 12.1 枚举

- 用户状态：`enabled` / `disabled`
- 申请状态：`pending` / `rejected` / `approved`
- 厨师状态：`enabled` / `disabled`
- 管理员状态：`enabled` / `disabled`
- 性别：`unknown` / `male` / `female`
- 申请历史动作：`submit` / `resubmit` / `approve` / `reject` / `update`

### 12.2 唯一约束建议

- `user.mobile` 唯一
- `user.openid` 唯一
- `chef.user_id` 唯一
- `chef.mobile` 唯一
- `admin_user.mobile` 唯一

### 12.3 业务约束

- 同一用户同一时刻只允许存在一条 `pending` 状态申请
- 已有正式厨师身份的用户不得再次提交厨师申请
- 同一申请不得重复审批
- 厨师登录手机号必须与对应用户手机号一致

## 13. 审批与事务规则

### 13.1 审批通过事务

审批通过必须在同一事务内完成：

- 校验申请状态
- 更新申请状态为 `approved`
- 写入审批人和审批时间
- 创建正式厨师记录
- 写入默认密码哈希与盐值
- 写入申请历史

任一步骤失败则整体回滚。

### 13.2 驳回事务

驳回必须在同一事务内完成：

- 校验申请状态
- 更新申请状态为 `rejected`
- 写入驳回原因
- 写入审批人和审批时间
- 写入申请历史

### 13.3 重新提交事务

重新提交必须在同一事务内完成：

- 更新申请资料
- 清空旧驳回原因
- 更新状态为 `pending`
- 更新提交时间
- 写入申请历史

## 14. 接口边界草案

### 14.1 客户端接口

- `POST /api/c-user/auth/wx-login`
- `GET /api/c-user/profile`
- `PUT /api/c-user/profile`
- `GET /api/c-chef-apply/current`
- `POST /api/c-chef-apply/submit`
- `PUT /api/c-chef-apply/resubmit`
- `POST /api/c-upload/file`

### 14.2 厨师端接口

- `POST /api/chef-auth/login`
- `POST /api/chef-auth/change-password`
- `GET /api/chef-auth/profile`
- `GET /api/chef-auth/status`

### 14.3 后管接口

认证接口：

- `POST /api/admin/auth/login`
- `POST /api/admin/auth/logout`
- `GET /api/admin/auth/me`
- `POST /api/admin/auth/change-password`

用户管理：

- `GET /api/admin/users`
- `GET /api/admin/users/{id}`
- `PUT /api/admin/users/{id}`
- `POST /api/admin/users/{id}/enable`
- `POST /api/admin/users/{id}/disable`

厨师管理：

- `GET /api/admin/chefs`
- `GET /api/admin/chefs/{id}`
- `PUT /api/admin/chefs/{id}`
- `POST /api/admin/chefs/{id}/enable`
- `POST /api/admin/chefs/{id}/disable`

入驻审批：

- `GET /api/admin/chef-applies`
- `GET /api/admin/chef-applies/{id}`
- `POST /api/admin/chef-applies/{id}/approve`
- `POST /api/admin/chef-applies/{id}/reject`

权限管理：

- `GET /api/admin/admin-users`
- `POST /api/admin/admin-users`
- `GET /api/admin/roles`
- `POST /api/admin/roles`
- `GET /api/admin/menus`
- `POST /api/admin/menus`

## 15. 开发阶段建议

### 15.1 第一阶段：需求与设计冻结

产出以下文档与设计结果：

- 需求规格说明
- 数据模型草案
- 接口清单草案
- 页面清单草案
- 开发任务拆分

### 15.2 第二阶段：平台底座

- 后端基础工程
- 数据库基础表
- `sa-token`
- RBAC
- 文件上传
- 统一异常与返回结构
- 日志基础能力

### 15.3 第三阶段：后管

- 管理员登录
- 权限菜单
- 用户列表
- 厨师列表
- 入驻审批
- 个人中心
- 修改密码

### 15.4 第四阶段：客户端

- 微信登录与手机号授权
- 用户入库
- 我的
- 入驻申请
- 状态与历史

### 15.5 第五阶段：厨师端

- 手机号密码登录
- 首次改密
- 个人中心
- 身份状态查看

## 16. 并行开发原则

后续多 session 并行开发建议按以下主线拆分：

- 文档与设计线
- 后端底座与 RBAC 线
- 后管前端线
- 客户端小程序线
- 厨师端小程序线

在核心表、接口边界与全局业务规则未冻结前，不进入多人并行业务编码阶段。
