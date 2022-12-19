import { Pagination } from '@/types'

export interface OrderDetail {
  _id: string
  productId: {
    mainImage: string
    _id: string
    name: string
    price: number
  }
  quantity: string
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
}

export interface Order {
  _id: string
  status: number
  orderDetail: OrderDetail[]
  shipment: Shipment
  total: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface OrderCustomerDetailParams {
  productId: string
  quantity: number
}

export interface OrderAllParams extends Pagination {
  orderBy: string
  sort: string
  status: 0 | 1 | 2 | 3
}

export interface OrderCustomerParams {
  orderDetail: OrderCustomerDetailParams[]
  shipment: string
  total: number
}
