import axios from 'axios'
import qs from 'qs'
import Cookies from 'js-cookie'

const tokenCookie = Cookies.get('token')

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,

  paramsSerializer: (params: Record<string, any>) => {
    if (params.range) {
      params.minPrice = params.range[0]
      params.maxPrice = params.range[1]
      delete params['range']
    }

    return qs.stringify(params, { arrayFormat: 'brackets' })
  },
})

//Delay request time for testing
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))

instance.interceptors.request.use(async (config: any) => {
  const token = tokenCookie

  if (token) {
    config.headers['authorization'] = token
  }

  await delay(500)

  return config
})

instance.interceptors.response.use(response => {
  return response
})

export default instance
