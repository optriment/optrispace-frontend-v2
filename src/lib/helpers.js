export function truncateString(str, num) {
  if (str.length <= num) {
    return str
  }

  return str.slice(0, num) + '...'
}

export const setToStorage = (key, value) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, value)
  }
}

export const getFromStorage = (key) => {
  if (typeof window !== 'undefined') {
    const value = localStorage.getItem(key)

    return value ? value.trim() : ''
  }

  return ''
}
