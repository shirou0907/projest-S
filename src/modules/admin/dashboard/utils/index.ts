import { Month, DashBoard } from '../types'

export const getCount = (data: DashBoard[]) => {
  const result: { value: number; total: number; title: string }[] = []
  for (let i = 1; i <= 12; i++) {
    result.push({
      value: i,
      title: Month[i],
      total: data.find(o => o._id.month === i)?.total || 0,
    })
  }
  return result
}
