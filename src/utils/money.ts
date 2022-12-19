const unformat = (value?: number | string) => {
  value = value || 0
  // Return the value as-is if it's already a number:
  if (typeof value === 'number') {
    return value
  }
  const regex = new RegExp('[^0-9]', 'g')
  const unformatted = parseFloat(
    value
      .toString()
      .replace(/\((?=\d+)(.*)\)/, '-$1') // replace bracketed values with negatives
      .replace(regex, '') // strip out any cruft
  )

  // This will fail silently which may cause trouble, let's wait and see:
  return !isNaN(unformatted) ? unformatted : 0
}

export const unCurrencyFormat = (value: number | string) => {
  return unformat(value)
}

const checkPrecision = (value: number, base = 0) => {
  value = Math.round(Math.abs(value))
  return isNaN(value) ? base : value
}

const toFixed = (value: number | string, precision = 0) => {
  precision = checkPrecision(precision)
  const power = Math.pow(10, precision)

  // Multiply up by precision, round accurately, then divide and use native toFixed():
  return (Math.round(unformat(value) * power) / power).toFixed(precision)
}

export const formatCurrency = (value: number | string, precision = 0, thousand = '.', decimal = '.') => {
  const number = Math.abs(unformat(value))
  const usePrecision = checkPrecision(precision)
  const base = parseInt(toFixed(Math.abs(number || 0), usePrecision), 10).toString()
  const mod = base.length > 3 ? base.length % 3 : 0
  return (
    (mod ? base.substr(0, mod) + thousand : '') +
    base.substr(mod).replace(/(\d{3})(?=\d)/g, '$1' + thousand) +
    (usePrecision ? decimal + toFixed(Math.abs(number), usePrecision).split('.')[1] : '')
  )
}
