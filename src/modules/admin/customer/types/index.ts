import { Pagination } from '@/types'

export enum CUSTOMER_ROLE {
  ADMIN = 1,
  USER = 2,
}

export const customerRoleOptions: Record<string, { label: string; value: number; color: string }> = {
  [CUSTOMER_ROLE.ADMIN]: { label: 'Admin', value: CUSTOMER_ROLE.ADMIN, color: 'danger' },
  [CUSTOMER_ROLE.USER]: { label: 'User', value: CUSTOMER_ROLE.USER, color: 'success' },
}

export interface Customer {
  _id: string
  uid: string
  email: string
  displayName: string
  role: 0 | 1 | 2
  emailVerified: boolean
  isAnonymous: boolean
  photoURL: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface CustomerParams extends Pagination {
  orderBy: string
  sort: string
}
