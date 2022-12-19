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

export interface ShipmentParams {
  userId: string
  userName: string
  userPhone: string
  address: string
  wardName: string
  districtName: string
  provinceName: string
}
