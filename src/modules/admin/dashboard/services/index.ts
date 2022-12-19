import { fetch } from '@/utils'
import { Response } from '@/types'
import { DashBoard, Count } from '../types'

export const getStatisicOrder = (year?: number) => {
  return fetch.get<Response<DashBoard[]>>('/statisic', { params: { year } })
}

export const getDashBoard = () => {
  return fetch.get<Response<Count>>('/dashboard')
}

export const getStatisicCustomer = (year?: number) => {
  return fetch.get<Response<DashBoard[]>>('/count-customer', { params: { year } })
}
