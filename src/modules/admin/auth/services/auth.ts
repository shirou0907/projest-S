import { fetch } from '@/utils'

interface ResultToken {
  token: string
  message: string
}

export const testLogin = () => {
  return fetch.get('/')
}

export const loginAdmin = (data: any) => {
  return fetch.post<ResultToken>('/users/login-admin', data)
}
