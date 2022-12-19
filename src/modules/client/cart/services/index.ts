import { fetch } from '@/utils'
import { Response } from '@/types'
import { Cart } from '../types'

export const getCart = () => {
  return fetch.get<Response<Cart>>('/cart')
}

export const addToCart = (id: string) => {
  return fetch.post(`/cart`, { productId: id })
}

export const updateCart = (id: string) => {
  return fetch.post(`/cart`, { productId: id })
}

export const deleteCart = (id: string) => {
  return fetch.put(`/cart`, { productId: id })
}

export const removeCart = (id: string) => {
  return fetch.delete(`/cart`, { data: { productId: id } })
}

export const destroyCart = (id: string) => {
  return fetch.delete(`/cart/all/${id}`)
}

export const countCart = () => {
  return fetch.get<Response<number>>(`/cart/count`)
}
