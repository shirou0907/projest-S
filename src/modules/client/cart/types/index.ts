export interface Cart {
  _id: string
  products: CartItem[]
  userId: string
  total: number
  createdAt: string
  updatedAt: string
}

export interface CartItem {
  _id: string
  productId: {
    _id: string
    name: string
    price: number
    stock: number
    mainImage: string
  }
  quantity: number
  createdAt: string
  updatedAt: string
}
