// NOTE: https://dockyard.com/blog/2020/02/14/you-probably-don-t-need-moment-js-anymore

export const formatDate = (date) => {
  return new Date(+date * 1000).toLocaleDateString('en-GB')
}

export const formatDateTime = (date) => {
  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }
  return new Date(+date * 1000).toLocaleDateString('en-GB', options)
}

export const toDaysMinutesSeconds = (totalSeconds) => {
  const seconds = Math.floor(totalSeconds % 60)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600)
  const days = Math.floor(totalSeconds / (3600 * 24))

  const secondsStr = makeHumanReadable(seconds, 'second')
  const minutesStr = makeHumanReadable(minutes, 'minute')
  const hoursStr = makeHumanReadable(hours, 'hour')
  const daysStr = makeHumanReadable(days, 'day')

  return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`.replace(/,\s*$/, '')
}

const makeHumanReadable = (num, singular) => {
  return num > 0 ? num + (num === 1 ? ` ${singular}, ` : ` ${singular}s, `) : ''
}
