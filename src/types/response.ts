export interface Response<T> {
  data: T
  message: string
  total: number
  status: boolean
}

export interface Pagination {
  page: number
  size: number
}
