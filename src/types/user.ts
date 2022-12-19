import type { User } from 'firebase/auth'

export interface Customer extends User {
  uid: string
  email: string
  emailVerified: boolean
  displayName: string
  isAnonymous: boolean
  photoURL: string
  providerData: Provide[]
  createdAt: string
  lastLoginAt: string
  apiKey: string
  appName: string
  role?: number
}

export interface Provide {
  providerId: string
  uid: string
  displayName: string
  email: string
  phoneNumber: string
  photoURL: string
}

export interface UserData {
  _id: string
  uid: string
  email: string
  displayName: string
  role: 0 | 1 | 2
  emailVerified: boolean
  isAnonymous: boolean
  photoURL: string
  createdAt: string
  updatedAt: string
  __v: number
}
