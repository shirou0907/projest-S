import { fetch } from '@/utils'
import { Response } from '@/types'
import { Product, ProductParams } from '../types'

export const getAllProducts = (params: Partial<ProductParams>) => {
  return fetch.get<Response<Product[]>>('/product/home', { params })
}
