export type AccountStatus = 'enabled' | 'disabled'
export type ApplyStatus = 'pending' | 'approved' | 'rejected'

export interface UserRecord {
  id: string
  name: string
  mobile: string
  city: string
  status: AccountStatus
  source: '微信登录'
  lastLoginAt: string
  registerAt: string
  note: string
}

export interface ChefRecord {
  id: string
  userId: string
  name: string
  mobile: string
  city: string
  status: AccountStatus
  rating: string
  orderCount: number
  passwordChanged: boolean
  joinedAt: string
  note: string
}

export interface ApplyRecord {
  id: string
  userId: string
  name: string
  mobile: string
  city: string
  status: ApplyStatus
  submittedAt: string
  reviewedAt?: string
  reviewer?: string
  rejectReason?: string
  description: string
  timeline: string[]
}

export interface LogRecord {
  time: string
  title: string
  detail: string
}

