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

export const isPositiveNumber = (value) => {
  return !isNaN(value) && value > 0
}

export const isAddress = (value) => {
  try {
    return utils.isAddress(value)
  } catch (e) {
    alert('Not a valid HEX address')
    throw e
  }
}
