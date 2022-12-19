import { fetch } from '@/utils'
import { Response } from '@/types'
import { Order, OrderCustomerParams, OrderAllParams } from '../types'

export const getOrderCustomer = (params: Partial<OrderAllParams>) => {
  return fetch.get<Response<Order[]>>('/order/customer', { params })
}

export const addOrderCustomer = (data: OrderCustomerParams) => {
  return fetch.post('/order/customer', data)
}
