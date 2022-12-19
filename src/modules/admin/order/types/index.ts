import { Pagination } from '@/types'

export interface OrderCount {
  all: number
  wait: number
  process: number
  cancel: number
}

export interface OrderDetail {
  productId: {
    name: string
    price: number
    mainImage: string
  }
  quantity: number
  createdAt: string
  updatedAt: string
}

export interface Shipment {
  _id: string
  userId: string
  userName: string
  userPhone: string
  address: string
  wardName: string
  districtName: string
  provinceName: string
  paymentMethod: string
  carrieName: string
  expectedDelivery: string
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Order {
  _id: string
  status: 0 | 1 | 2
  orderDetail: OrderDetail[]
  shipment: Shipment
  total: 1000000
  createdAt: string
  updatedAt: string
  __v: number
}

export interface OrderAllParams extends Pagination {
  orderBy: string
  sort: string
  status: 0 | 1 | 2
}
