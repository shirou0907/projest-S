import { fetch } from '@/utils'
import { Response } from '@/types'
import { Order, OrderAllParams, OrderCount } from '../types'

export const getAllOrder = (params: Partial<OrderAllParams>) => {
  return fetch.get<Response<Order[]>>('/order', { params })
}

export const getOrderCount = () => {
  return fetch.get<Response<OrderCount>>('/order/count')
}

export const getOrderById = (id: string) => {
  return fetch.get<Response<Order>>(`/order/${id}`)
}

export const confirmOrder = (id: string) => {
  return fetch.put(`/order/${id}/confirm`)
}

export const cancelOrder = (id: string) => {
  return fetch.put(`/order/${id}/cancel`)
}
