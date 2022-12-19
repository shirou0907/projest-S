import { fetch } from '@/utils'
import { Response } from '@/types'

import { Product, ProductParams, UpdateProductBasicParams, AddProductParams, ProductAttribute } from '../types'

export const getALlProducts = (params: ProductParams) => {
  return fetch.get<Response<Product[]>>(`/product`, { params })
}

export const addNewProduct = (data: AddProductParams) => {
  return fetch.post<Response<Product>>(`/product`, data)
}

export const getProductById = (id: string) => {
  return fetch.get<Response<Product>>(`/product/${id}`)
}

export const updateProductBasicById = (id: string, data: UpdateProductBasicParams) => {
  return fetch.put<Response<Product>>(`/product/${id}`, data)
}

export const updateProductAttributeById = (id: string, data: ProductAttribute[]) => {
  return fetch.put<Response<Product>>(`/product/${id}/attribute`, { attributes: data })
}

export const enableProduct = (id: string) => {
  return fetch.put<Response<Product>>(`/product/${id}/enabled`)
}

export const disableProduct = (id: string) => {
  return fetch.put<Response<Product>>(`/product/${id}/disabled`)
}

export const uploadMainImage = (id: string, data: FormData) => {
  return fetch.post<Response<Product>>(`/product/${id}/image`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}

export const uploadSubImages = (id: string, data: FormData) => {
  return fetch.post<Response<Product>>(`/product/${id}/images`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
}
