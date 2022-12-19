import { fetch } from '@/utils'
import { Response } from '@/types'
import { Product, ProductComments } from '../types'

export const getProductById = (id: string) => {
  return fetch.get<Response<Product>>(`/product/${id}`)
}

export const getProductComment = (id: string) => {
  return fetch.get<Response<ProductComments[]>>(`/product/${id}/comment`)
}

export const addProductComment = (id: string, comment: string, rate: number) => {
  return fetch.post(`/product/${id}/comment`, { comment, rate })
}

export const searchProduct = (keyword: string) => {
  return fetch.get<Response<Product[]>>(`/product/search?name=${keyword}`)
}
