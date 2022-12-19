import { fetch } from '@/utils'
import { UserData, Theme, Response } from '@/types'

export const getProfile = () => {
  return fetch.get<UserData>('/users/get-profile')
}

export const getThemeStyle = () => {
  return fetch.get<Response<Theme>>('/theme')
}

export const updateThemeStyle = (data: Partial<Theme>) => {
  return fetch.post('/theme', data)
}

export const updateBannerTop = (data: FormData) => {
  return fetch.post('/theme/banner-top', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateBannerBottom = (data: FormData) => {
  return fetch.post('/theme/banner-bottom', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}

export const updateSlides = (data: FormData) => {
  return fetch.post('/theme/slides', data, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
}
