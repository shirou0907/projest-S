import axios from 'axios'
import { fetch } from '@/utils'
import { Shipment, ShipmentParams } from '../types'

export type Province = Record<string, { code: string; file_path: string }>

export type DistrictAll = {
  code: string
  district: District[]
}

export interface District {
  name: string
  pre: string
  ward: Ward[]
}

export interface Ward {
  name: string
  pre: string
}

export const getProvince = () => {
  return axios.get<Province>('https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/Index.json')
}

export const getDistrict = (path: string) => {
  return axios.get<DistrictAll>(`https://cdn.jsdelivr.net/gh/thien0291/vietnam_dataset@1.0.0/${path}`)
}

export const getAllShipment = () => {
  return fetch.get<Shipment[]>('/users/shipment')
}

export const addShipment = (data: ShipmentParams) => {
  return fetch.post('/users/shipment', data)
}

export const deleteShipment = (id: string) => {
  return fetch.put(`/users/shipment/${id}`)
}
