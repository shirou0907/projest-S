export interface DashBoard {
  _id: {
    month: number
    year: number
  }
  total: number
}

export interface Count {
  customer: number
  product: number
  order: number
}

export enum Month {
  'Jan' = 1,
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
}
