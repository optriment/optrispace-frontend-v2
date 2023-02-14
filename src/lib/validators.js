import { utils } from 'ethers'

export const isEmptyString = (string) => {
  return (
    typeof string === 'undefined' ||
    string === null ||
    string.toString().trim().length == 0
  )
}

export const isNotDefined = (value) => {
  return typeof value === 'undefined' || value === null
}

export const isNumber = (value) => {
  return typeof value === 'number' && !isNaN(value)
}

export const isPositiveNumber = (value) => {
  if (isNumber(value)) {
    if (Number.isInteger(value)) {
      return +value > 0
    }

    return parseFloat(value) > 0
  }

  return false
}

export const isPositiveInteger = (string) => {
  const number = Number(string)
  const isInteger = Number.isInteger(number)
  const isPositive = number > 0

  return isInteger && isPositive
}

export const isAddress = (value) => {
  try {
    return utils.isAddress(value)
  } catch (e) {
    alert('Not a valid HEX address')
    throw e
  }
}
