interface TimeDiffParams {
  timeStart: EpochTimeStamp
  timeEnd: EpochTimeStamp
}

export const getTimeDiff = ({ timeStart, timeEnd }: TimeDiffParams) => {
  const difference = Math.abs(timeEnd - timeStart)
  const days = Math.floor(difference / 1000 / 60 / 60 / 24)

  const hours = Math.floor(difference / 1000 / 60 / 60)

  const minutes = Math.floor(difference / 1000 / 60)

  const seconds = Math.floor(difference / 1000)

  return { days, hours, minutes, seconds }
}
