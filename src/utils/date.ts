export const getLocalDate = (date: string) => {
  const localDate = new Date(date)
  return localDate.toLocaleString()
}
