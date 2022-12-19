import { Pagination } from '@/types'

export interface ProductAttribute {
  type: 'MORE_DETAILS' | 'GUARANTEE_AND_RETURNS' | 'SIZE_AND_FIT'
  title: string
  content: string
}

export interface ProductOption {
  colors: string[]
  sizes: string[]
}

export interface ProductCommentCustomer {
  email: string
  displayName: string
  photoURL: string
}

export interface ProductComments {
  _id: string
  rate: number
  comment: string
  date: string
  customer: ProductCommentCustomer
}

export interface Product {
  _id: string
  name: string
  tag: string[]
  description: string
  options: ProductOption
  attributes: ProductAttribute[]
  mainImage: string
  images: string[]
  active: boolean
  price: number
  stock: number
  weight: number
  height: number
  width: number
  length: number
  status: number
  comments: ProductComments[]
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ProductParams extends Pagination {
  minPrice: number
  maxPrice: number
  p_color: string
  p_size: string
  orderBy: string
  sort: string
}

export interface AddProductParams {
  name: string
  description: string
  tag: string[]
  price: number
  stock: number
}
