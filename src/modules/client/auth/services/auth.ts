import { fetch } from '@/utils'

interface ResultToken {
  token: string
  message: string
}

export const login = (data: any) => {
  return fetch.post<ResultToken>('/users/login', data)
}
