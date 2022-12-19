import { Pagination } from '@/types'

export interface Tag {
  _id: string
  name: string
  description: string
  active: boolean
  createdAt: string
  updatedAt: string
  __v: number
}

export interface TagParams extends Pagination {
  orderBy: string
  sort: string
}

export interface UpdateTagParams {
  name: string
  description: string
}
