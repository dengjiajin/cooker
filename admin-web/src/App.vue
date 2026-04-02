<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { seedApplies, seedChefs, seedLogs, seedUsers } from './mock'
import type { AccountStatus, ApplyRecord, ApplyStatus, ChefRecord, UserRecord } from './types'

type ViewKey = 'dashboard' | 'users' | 'chefs' | 'approvals' | 'permissions' | 'profile'
type PanelKind = 'user' | 'chef' | 'apply'
type PanelMode = 'detail' | 'edit' | 'approval'

function isAccountStatus(value: AccountStatus | ApplyStatus): value is AccountStatus {
  return value === 'enabled' || value === 'disabled'
}

const loggedIn = ref(false)
const activeView = ref<ViewKey>('dashboard')
const activeApprovalTab = ref<ApplyStatus | 'all'>('pending')

const loginForm = reactive({
  mobile: '18800000000',
  password: 'admin123',
})

const userSearch = reactive({
  keyword: '',
  status: 'all' as AccountStatus | 'all',
})

const chefSearch = reactive({
  keyword: '',
  status: 'all' as AccountStatus | 'all',
})

const panel = reactive({
  visible: false,
  kind: 'user' as PanelKind,
  mode: 'detail' as PanelMode,
  item: null as UserRecord | ChefRecord | ApplyRecord | null,
  form: {
    name: '',
    mobile: '',
    city: '',
    status: 'enabled' as AccountStatus,
    reason: '',
    note: '',
  },
})

const toast = ref('欢迎回来，当前是管理后台 UI 原型')

const users = ref<UserRecord[]>(structuredClone(seedUsers))
const chefs = ref<ChefRecord[]>(structuredClone(seedChefs))
const applies = ref<ApplyRecord[]>(structuredClone(seedApplies))
const logs = ref(seedLogs)

const menu = [
  { key: 'dashboard', title: '首页', subtitle: '轻量统计与待办' },
  { key: 'users', title: '用户管理', subtitle: '微信登录用户' },
  { key: 'chefs', title: '厨师管理', subtitle: '正式厨师身份' },
  { key: 'approvals', title: '入驻审批', subtitle: '待审 / 已通过 / 已驳回' },
  { key: 'permissions', title: '权限管理', subtitle: '管理员、角色、菜单' },
  { key: 'profile', title: '个人中心', subtitle: '基础资料与改密' },
] as const

const stats = computed(() => {
  const pending = applies.value.filter((item) => item.status === 'pending').length
  const activeUsers = users.value.filter((item) => item.status === 'enabled').length
  const activeChefs = chefs.value.filter((item) => item.status === 'enabled').length
  const approved = applies.value.filter((item) => item.status === 'approved').length
  return [
    { label: '用户数', value: String(activeUsers), hint: '客户端微信登录用户' },
    { label: '厨师数', value: String(activeChefs), hint: '审批通过的厨师账号' },
    { label: '待审入驻', value: String(pending), hint: '当前待审核申请' },
    { label: '已通过申请', value: String(approved), hint: '已沉淀为厨师身份' },
  ]
})

const filteredUsers = computed(() =>
  users.value.filter((item) => {
    const keyword = userSearch.keyword.trim()
    const matchKeyword =
      !keyword ||
      [item.name, item.mobile, item.city, item.note].some((text) => text.includes(keyword))
    const matchStatus = userSearch.status === 'all' || item.status === userSearch.status
    return matchKeyword && matchStatus
  }),
)

const filteredChefs = computed(() =>
  chefs.value.filter((item) => {
    const keyword = chefSearch.keyword.trim()
    const matchKeyword =
      !keyword ||
      [item.name, item.mobile, item.city, item.note].some((text) => text.includes(keyword))
    const matchStatus = chefSearch.status === 'all' || item.status === chefSearch.status
    return matchKeyword && matchStatus
  }),
)

const filteredApplies = computed(() => {
  const items = activeApprovalTab.value === 'all'
    ? applies.value
    : applies.value.filter((item) => item.status === activeApprovalTab.value)
  return items
})

function login() {
  loggedIn.value = true
  activeView.value = 'dashboard'
  toast.value = '已登录到管理后台原型'
}

function openPanel(kind: PanelKind, mode: PanelMode, item: UserRecord | ChefRecord | ApplyRecord) {
  panel.visible = true
  panel.kind = kind
  panel.mode = mode
  panel.item = item
  panel.form.name = item.name
  panel.form.mobile = item.mobile
  panel.form.city = item.city
  panel.form.status = 'status' in item && isAccountStatus(item.status) ? item.status : 'enabled'
  panel.form.reason = 'rejectReason' in item ? item.rejectReason ?? '' : ''
  panel.form.note = 'note' in item ? item.note : ''
}

function closePanel() {
  panel.visible = false
  panel.item = null
  panel.form.reason = ''
  panel.form.note = ''
}

function saveUserEdit() {
  if (!panel.item || panel.kind !== 'user') return
  users.value = users.value.map((item) =>
    item.id === panel.item?.id
      ? {
          ...item,
          name: panel.form.name,
          mobile: panel.form.mobile,
          city: panel.form.city,
          status: panel.form.status,
          note: panel.form.note,
        }
      : item,
  )
  toast.value = '用户资料已更新'
  closePanel()
}

function saveChefEdit() {
  if (!panel.item || panel.kind !== 'chef') return
  chefs.value = chefs.value.map((item) =>
    item.id === panel.item?.id
      ? {
          ...item,
          name: panel.form.name,
          mobile: panel.form.mobile,
          city: panel.form.city,
          status: panel.form.status,
          note: panel.form.note,
        }
      : item,
  )
  toast.value = '厨师资料已更新'
  closePanel()
}

function saveRejection() {
  if (!panel.item || panel.kind !== 'apply') return
  applies.value = applies.value.map((item) =>
    item.id === panel.item?.id
      ? {
          ...item,
          status: 'rejected',
          reviewedAt: '2026-04-02 11:18',
          reviewer: '超级管理员',
          rejectReason: panel.form.reason || '资料不完整',
          timeline: [...item.timeline, '11:18 驳回并填写原因'],
        }
      : item,
  )
  toast.value = '申请已驳回'
  closePanel()
}

function approveApply(item: ApplyRecord) {
  applies.value = applies.value.map((record) =>
    record.id === item.id
      ? {
          ...record,
          status: 'approved',
          reviewedAt: '2026-04-02 11:18',
          reviewer: '超级管理员',
          timeline: [...record.timeline, '11:18 审核通过'],
        }
      : record,
  )

  const exists = chefs.value.some((chef) => chef.mobile === item.mobile)
  if (!exists) {
    chefs.value = [
      {
        id: `C-${Math.floor(Math.random() * 9000 + 1000)}`,
        userId: item.userId,
        name: item.name,
        mobile: item.mobile,
        city: item.city,
        status: 'enabled',
        rating: '4.8',
        orderCount: 0,
        passwordChanged: false,
        joinedAt: '2026-04-02 11:18',
        note: '默认密码 666666，待首次修改',
      },
      ...chefs.value,
    ]
  }

  const user = users.value.find((record) => record.id === item.userId)
  if (user) {
    user.note = '审批通过，已进入厨师列表'
  }

  toast.value = '审批通过，默认密码已生成：666666'
}

function toggleUserStatus(item: UserRecord) {
  users.value = users.value.map((record) =>
    record.id === item.id
      ? { ...record, status: record.status === 'enabled' ? 'disabled' : 'enabled' }
      : record,
  )
  toast.value = `用户已${item.status === 'enabled' ? '禁用' : '启用'}`
}

function toggleChefStatus(item: ChefRecord) {
  chefs.value = chefs.value.map((record) =>
    record.id === item.id
      ? { ...record, status: record.status === 'enabled' ? 'disabled' : 'enabled' }
      : record,
  )
  toast.value = `厨师已${item.status === 'enabled' ? '禁用' : '启用'}`
}

function loginLabel(status: AccountStatus) {
  return status === 'enabled' ? '启用' : '禁用'
}

function applyLabel(status: ApplyStatus) {
  return status === 'pending' ? '待审核' : status === 'approved' ? '已通过' : '已驳回'
}

function statusClass(status: AccountStatus | ApplyStatus) {
  return `status-${status}`
}
</script>

<template>
  <div class="login-page" v-if="!loggedIn">
    <div class="login-card">
      <div class="login-copy">
        <span class="eyebrow">到家服务平台</span>
        <h1>管理后台 UI 原型</h1>
        <p>
          先做真实可交互页面，再接后端。这个版本用于确认首页、用户管理、厨师管理和入驻审批的视觉与信息结构。
        </p>
        <div class="login-highlights">
          <div>
            <strong>4</strong>
            <span>核心页面</span>
          </div>
          <div>
            <strong>1</strong>
            <span>套治理链路</span>
          </div>
          <div>
            <strong>0</strong>
            <span>后端依赖</span>
          </div>
        </div>
      </div>

      <form class="login-form" @submit.prevent="login">
        <h2>管理员登录</h2>
        <label>
          <span>手机号</span>
          <input v-model="loginForm.mobile" type="text" placeholder="请输入手机号" />
        </label>
        <label>
          <span>密码</span>
          <input v-model="loginForm.password" type="password" placeholder="请输入密码" />
        </label>
        <button type="submit">进入后台</button>
        <p class="login-footnote">当前为前端原型，后续再接 `sa-token` 与后端接口。</p>
      </form>
    </div>
  </div>

  <div class="shell" v-else>
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">C</div>
        <div>
          <strong>到家服务平台</strong>
          <span>Admin UI Prototype</span>
        </div>
      </div>

      <nav class="menu">
        <button
          v-for="item in menu"
          :key="item.key"
          class="menu-item"
          :class="{ active: activeView === item.key }"
          @click="activeView = item.key"
        >
          <span>{{ item.title }}</span>
          <small>{{ item.subtitle }}</small>
        </button>
      </nav>

      <div class="sidebar-card">
        <span>当前会话</span>
        <strong>超级管理员</strong>
        <small>支持启用/禁用、审批与权限管理</small>
      </div>
    </aside>

    <main class="main">
      <header class="topbar">
        <div>
          <h1>{{ menu.find((item) => item.key === activeView)?.title }}</h1>
          <p>{{ menu.find((item) => item.key === activeView)?.subtitle }}</p>
        </div>
        <div class="topbar-actions">
          <div class="search-pill">
            <span>⌘K</span>
            <input type="text" placeholder="搜索用户 / 厨师 / 申请" />
          </div>
          <button class="ghost-btn" @click="toast = '消息中心暂未接后端'">消息</button>
          <div class="avatar">A</div>
        </div>
      </header>

      <section class="notice">
        <div>
          <strong>{{ toast }}</strong>
          <span>后管首页采用轻量统计卡片，不做复杂大屏。</span>
        </div>
        <button class="ghost-btn" @click="activeView = 'approvals'">查看待审</button>
      </section>

      <section v-if="activeView === 'dashboard'" class="page-stack">
        <div class="stats-grid">
          <article v-for="stat in stats" :key="stat.label" class="stat-card">
            <span>{{ stat.label }}</span>
            <strong>{{ stat.value }}</strong>
            <small>{{ stat.hint }}</small>
          </article>
        </div>

        <div class="grid-2">
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>待审核入驻</h2>
                <p>当前最需要处理的业务流</p>
              </div>
              <button class="ghost-btn" @click="activeView = 'approvals'">去审批</button>
            </div>
            <div class="pending-list">
              <article v-for="item in applies.filter((item) => item.status === 'pending')" :key="item.id" class="pending-card">
                <div>
                  <strong>{{ item.name }}</strong>
                  <p>{{ item.city }} · {{ item.mobile }}</p>
                </div>
                <span :class="['status-pill', statusClass(item.status)]">{{ applyLabel(item.status) }}</span>
              </article>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>最近操作</h2>
                <p>用于快速感知平台治理动作</p>
              </div>
            </div>
            <div class="log-list">
              <article v-for="log in logs" :key="log.time + log.title" class="log-item">
                <span>{{ log.time }}</span>
                <div>
                  <strong>{{ log.title }}</strong>
                  <p>{{ log.detail }}</p>
                </div>
              </article>
            </div>
          </section>
        </div>
      </section>

      <section v-else-if="activeView === 'users'" class="page-stack">
        <div class="toolbar">
          <input v-model="userSearch.keyword" class="input" placeholder="搜索姓名、手机号、城市、备注" />
          <select v-model="userSearch.status" class="input select">
            <option value="all">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">禁用</option>
          </select>
          <button class="ghost-btn">导出</button>
        </div>

        <section class="panel">
          <table class="table">
            <thead>
              <tr>
                <th>用户</th>
                <th>手机号</th>
                <th>城市</th>
                <th>状态</th>
                <th>最近登录</th>
                <th>来源</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id">
                <td>
                  <strong>{{ user.name }}</strong>
                  <div class="subline">{{ user.note }}</div>
                </td>
                <td>{{ user.mobile }}</td>
                <td>{{ user.city }}</td>
                <td><span :class="['status-pill', statusClass(user.status)]">{{ loginLabel(user.status) }}</span></td>
                <td>{{ user.lastLoginAt }}</td>
                <td>{{ user.source }}</td>
                <td>
                  <div class="action-row">
                    <button class="link-btn" @click="openPanel('user', 'detail', user)">详情</button>
                    <button class="link-btn" @click="openPanel('user', 'edit', user)">修改</button>
                    <button class="link-btn danger" @click="toggleUserStatus(user)">{{ user.status === 'enabled' ? '禁用' : '启用' }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>

      <section v-else-if="activeView === 'chefs'" class="page-stack">
        <div class="toolbar">
          <input v-model="chefSearch.keyword" class="input" placeholder="搜索姓名、手机号、城市、备注" />
          <select v-model="chefSearch.status" class="input select">
            <option value="all">全部状态</option>
            <option value="enabled">启用</option>
            <option value="disabled">禁用</option>
          </select>
          <button class="ghost-btn">刷新</button>
        </div>

        <section class="panel">
          <table class="table">
            <thead>
              <tr>
                <th>厨师</th>
                <th>手机号</th>
                <th>城市</th>
                <th>状态</th>
                <th>评分</th>
                <th>订单数</th>
                <th>首次改密</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="chef in filteredChefs" :key="chef.id">
                <td>
                  <strong>{{ chef.name }}</strong>
                  <div class="subline">{{ chef.note }}</div>
                </td>
                <td>{{ chef.mobile }}</td>
                <td>{{ chef.city }}</td>
                <td><span :class="['status-pill', statusClass(chef.status)]">{{ loginLabel(chef.status) }}</span></td>
                <td>{{ chef.rating }}</td>
                <td>{{ chef.orderCount }}</td>
                <td>{{ chef.passwordChanged ? '已完成' : '待修改' }}</td>
                <td>
                  <div class="action-row">
                    <button class="link-btn" @click="openPanel('chef', 'detail', chef)">详情</button>
                    <button class="link-btn" @click="openPanel('chef', 'edit', chef)">修改</button>
                    <button class="link-btn danger" @click="toggleChefStatus(chef)">{{ chef.status === 'enabled' ? '禁用' : '启用' }}</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>

      <section v-else-if="activeView === 'approvals'" class="page-stack">
        <div class="tab-row">
          <button
            v-for="tab in ['pending', 'approved', 'rejected'] as const"
            :key="tab"
            class="tab-btn"
            :class="{ active: activeApprovalTab === tab }"
            @click="activeApprovalTab = tab"
          >
            {{ applyLabel(tab) }}
          </button>
        </div>

        <section class="panel">
          <table class="table">
            <thead>
              <tr>
                <th>申请人</th>
                <th>手机号</th>
                <th>城市</th>
                <th>状态</th>
                <th>提交时间</th>
                <th>审核人</th>
                <th>操作</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="apply in filteredApplies" :key="apply.id">
                <td>
                  <strong>{{ apply.name }}</strong>
                  <div class="subline">{{ apply.description }}</div>
                </td>
                <td>{{ apply.mobile }}</td>
                <td>{{ apply.city }}</td>
                <td><span :class="['status-pill', statusClass(apply.status)]">{{ applyLabel(apply.status) }}</span></td>
                <td>{{ apply.submittedAt }}</td>
                <td>{{ apply.reviewer ?? '待定' }}</td>
                <td>
                  <div class="action-row">
                    <button class="link-btn" @click="openPanel('apply', 'approval', apply)">查看</button>
                    <button v-if="apply.status === 'pending'" class="link-btn success" @click="approveApply(apply)">通过</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </section>
      </section>

      <section v-else-if="activeView === 'permissions'" class="page-stack">
        <div class="grid-2">
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>管理员</h2>
                <p>当前仅保留一个超级管理员角色，后续可扩展</p>
              </div>
            </div>
            <div class="stack-list">
              <article class="stack-card">
                <strong>超级管理员</strong>
                <p>拥有全部菜单、按钮和审批权限</p>
              </article>
              <article class="stack-card">
                <strong>审核专员</strong>
                <p>仅保留入驻审批与详情查看权限</p>
              </article>
            </div>
          </section>

          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>菜单结构</h2>
                <p>按正常后台做完整 RBAC 预留</p>
              </div>
            </div>
            <div class="menu-tree">
              <div>首页</div>
              <div>用户管理</div>
              <div>厨师管理</div>
              <div>入驻审批</div>
              <div>权限管理</div>
              <div>个人中心</div>
            </div>
          </section>
        </div>
      </section>

      <section v-else class="page-stack">
        <div class="grid-2">
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>管理员资料</h2>
                <p>后管独立账号体系</p>
              </div>
            </div>
            <div class="profile-card">
              <strong>超级管理员</strong>
              <p>手机号：18800000000</p>
              <p>权限：全部菜单 / 审批 / 用户 / 厨师 / 角色</p>
            </div>
          </section>
          <section class="panel">
            <div class="panel-head">
              <div>
                <h2>修改密码</h2>
                <p>首版先做基础改密表单</p>
              </div>
            </div>
            <form class="password-form">
              <input class="input" placeholder="旧密码" type="password" />
              <input class="input" placeholder="新密码" type="password" />
              <input class="input" placeholder="确认新密码" type="password" />
              <button class="primary-btn" type="button">保存修改</button>
            </form>
          </section>
        </div>
      </section>
    </main>

    <transition name="slide">
      <aside v-if="panel.visible" class="drawer">
        <div class="drawer-head">
          <div>
            <span class="eyebrow">{{ panel.kind === 'user' ? '用户' : panel.kind === 'chef' ? '厨师' : '入驻申请' }}</span>
            <h3>
              {{
                panel.kind === 'user'
                  ? (panel.item as UserRecord).name
                  : panel.kind === 'chef'
                    ? (panel.item as ChefRecord).name
                    : (panel.item as ApplyRecord).name
              }}
            </h3>
          </div>
          <button class="ghost-btn" @click="closePanel">关闭</button>
        </div>

        <div v-if="panel.kind === 'user'" class="drawer-body">
          <template v-if="panel.mode === 'detail'">
            <div class="drawer-grid">
              <div><label>姓名</label><p>{{ (panel.item as UserRecord).name }}</p></div>
              <div><label>手机号</label><p>{{ (panel.item as UserRecord).mobile }}</p></div>
              <div><label>城市</label><p>{{ (panel.item as UserRecord).city }}</p></div>
              <div><label>状态</label><p>{{ loginLabel((panel.item as UserRecord).status) }}</p></div>
              <div><label>最近登录</label><p>{{ (panel.item as UserRecord).lastLoginAt }}</p></div>
              <div><label>备注</label><p>{{ (panel.item as UserRecord).note }}</p></div>
            </div>
            <button class="primary-btn" @click="panel.mode = 'edit'">编辑用户</button>
          </template>
          <template v-else>
            <label>姓名<input v-model="panel.form.name" class="input" /></label>
            <label>手机号<input v-model="panel.form.mobile" class="input" /></label>
            <label>城市<input v-model="panel.form.city" class="input" /></label>
            <label>备注<textarea v-model="panel.form.note" class="input textarea" /></label>
            <label>状态
              <select v-model="panel.form.status" class="input select">
                <option value="enabled">启用</option>
                <option value="disabled">禁用</option>
              </select>
            </label>
            <button class="primary-btn" @click.prevent="saveUserEdit">保存修改</button>
          </template>
        </div>

        <div v-else-if="panel.kind === 'chef'" class="drawer-body">
          <template v-if="panel.mode === 'detail'">
            <div class="drawer-grid">
              <div><label>姓名</label><p>{{ (panel.item as ChefRecord).name }}</p></div>
              <div><label>手机号</label><p>{{ (panel.item as ChefRecord).mobile }}</p></div>
              <div><label>城市</label><p>{{ (panel.item as ChefRecord).city }}</p></div>
              <div><label>状态</label><p>{{ loginLabel((panel.item as ChefRecord).status) }}</p></div>
              <div><label>评分</label><p>{{ (panel.item as ChefRecord).rating }}</p></div>
              <div><label>首次改密</label><p>{{ (panel.item as ChefRecord).passwordChanged ? '已完成' : '待修改' }}</p></div>
              <div><label>入驻时间</label><p>{{ (panel.item as ChefRecord).joinedAt }}</p></div>
              <div><label>备注</label><p>{{ (panel.item as ChefRecord).note }}</p></div>
            </div>
            <button class="primary-btn" @click="panel.mode = 'edit'">编辑厨师</button>
          </template>
          <template v-else>
            <label>姓名<input v-model="panel.form.name" class="input" /></label>
            <label>手机号<input v-model="panel.form.mobile" class="input" /></label>
            <label>城市<input v-model="panel.form.city" class="input" /></label>
            <label>备注<textarea v-model="panel.form.note" class="input textarea" /></label>
            <label>状态
              <select v-model="panel.form.status" class="input select">
                <option value="enabled">启用</option>
                <option value="disabled">禁用</option>
              </select>
            </label>
            <button class="primary-btn" @click.prevent="saveChefEdit">保存修改</button>
          </template>
        </div>

        <div v-else class="drawer-body">
          <template v-if="panel.mode === 'approval'">
            <div class="drawer-grid">
              <div><label>申请人</label><p>{{ (panel.item as ApplyRecord).name }}</p></div>
              <div><label>手机号</label><p>{{ (panel.item as ApplyRecord).mobile }}</p></div>
              <div><label>城市</label><p>{{ (panel.item as ApplyRecord).city }}</p></div>
              <div><label>状态</label><p>{{ applyLabel((panel.item as ApplyRecord).status) }}</p></div>
              <div><label>提交时间</label><p>{{ (panel.item as ApplyRecord).submittedAt }}</p></div>
              <div><label>审核人</label><p>{{ (panel.item as ApplyRecord).reviewer ?? '待审核' }}</p></div>
              <div class="full"><label>申请说明</label><p>{{ (panel.item as ApplyRecord).description }}</p></div>
              <div class="full"><label>时间线</label><p>{{ (panel.item as ApplyRecord).timeline.join(' · ') }}</p></div>
              <div v-if="(panel.item as ApplyRecord).rejectReason" class="full"><label>驳回原因</label><p>{{ (panel.item as ApplyRecord).rejectReason }}</p></div>
            </div>
            <label>驳回原因<textarea v-model="panel.form.reason" class="input textarea" placeholder="请输入驳回原因" /></label>
            <div class="drawer-actions">
              <button class="ghost-btn" @click="closePanel">取消</button>
              <button class="danger-btn" @click.prevent="saveRejection">驳回</button>
              <button class="primary-btn" @click.prevent="approveApply(panel.item as ApplyRecord)">通过并生成厨师</button>
            </div>
          </template>
        </div>
      </aside>
    </transition>
  </div>
</template>
