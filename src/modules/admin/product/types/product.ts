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
  createdAt: string
  updatedAt: string
  __v: number
}

export interface ProductParams extends Pagination {
  name: string
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

export interface UpdateProductBasicParams {
  name: string
  tag: string[]
  description: string
  active: boolean
  price: number
  stock: number
  weight: number
  height: number
  width: number
  length: number
}
