import { fetch } from '@/utils'
import { Response } from '@/types'
import { Customer, CustomerParams } from '../types'

export const getAllCustomers = (params: Partial<CustomerParams>) => {
  return fetch.get<Response<Customer[]>>('/users/get-all', { params })
}
