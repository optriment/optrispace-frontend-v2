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
  if (typeof value === 'string' && value.match(/^\d+(\.\d+)?$/)) {
    return true
  }

  if (typeof value === 'number' && !isNaN(value)) {
    return true
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
