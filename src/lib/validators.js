import { utils } from 'ethers'

export const isEmptyString = (string) => {
  return (
    typeof string === 'undefined' ||
    string === null ||
    string.toString().trim().length == 0
  )
}

export const isNumber = (value) => {
  if (typeof value === 'number') return true
  if (typeof value !== 'string') return false
  if (isNaN(value)) return false
  if (!value.match(/^\d+(\.\d+)?$/)) return false

  return true
}

export const isPositiveInteger = (value) => {
  if (!isNumber(value)) return false

  return Number.isInteger(+value) && +value > 0
}

export const isAddress = (value) => {
  try {
    return utils.isAddress(value)
  } catch (e) {
    new Error('Not a valid HEX address')
  }
}
