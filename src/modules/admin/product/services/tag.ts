import { fetch } from '@/utils'
import { Response } from '@/types'
import { Tag, TagParams, UpdateTagParams } from '../types'

export const getALlTags = (params?: Partial<TagParams>) => {
  return fetch.get<Response<Tag[]>>('/tag', { params })
}

export const addNewTag = (data: UpdateTagParams) => {
  return fetch.post('/tag', data)
}

export const updateTag = (id: string, data: UpdateTagParams) => {
  return fetch.put(`/tag/${id}`, data)
}

export const enableTag = (id: string) => {
  return fetch.put(`/tag/${id}/enabled`)
}

export const disableTag = (id: string) => {
  return fetch.put(`/tag/${id}/disabled`)
}
