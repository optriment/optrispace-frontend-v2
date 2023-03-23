export const errorHandler = (error, context = '') => {
  if (typeof error === 'string') {
    throw new Error('Strings are not allowed in errorHandler')
  }

  if (!error) {
    throw new Error('Error must be defined')
  }

  // FIXME: Remove it before deploy to production
  console.log('--- errorHandler ---')
  console.log(error.code)
  console.log(error?.reason)
  console.log(error?.message)
  console.log({ context })

  if (error?.code) {
    switch (error.code) {
      case 'ACTION_REJECTED':
        return 'You rejected the transaction! Please try again.'

      case 'CALL_EXCEPTION':
        if (error?.method === 'releaseName()') {
          return 'Unable to get release name.'
        }

        if (error?.errorName) {
          if (error.errorName === 'CustomerOnly') {
            return 'Customer only'
          }
        }

        if (error?.message) {
          if (error.message.match(/JobDoesNotExist/)) {
            return 'Job does not exist'
          }

          if (error.message.match(/ApplicationDoesNotExist/)) {
            return 'Application does not exist'
          }

          if (error.message.match(/Unauthorized/)) {
            return 'Access denied'
          }
        }

        break

      case 'NUMERIC_FAULT':
        return 'Expected numeric values, but something went wrong'

      case 'UNPREDICTABLE_GAS_LIMIT':
        if (error?.reason) {
          if (error.reason.match(/Must not be contract owner/)) {
            return 'Must not be contract owner'
          }

          if (error.reason.match(/DaysToStartWorkOverflow/)) {
            return 'Days to start work must be between 1-7 days'
          }

          if (error.reason.match(/DurationInDaysOverflow/)) {
            return 'Days to deliver result must be between 1-31 days'
          }
        }

        return 'Unable to estimate gas'
      case 'INVALID_ARGUMENT':
        return `Invalid argument: ${error.argument}`
    }

    if (error.message.match(/NotAvailableNow/)) {
      return 'Requested function is not available now'
    }

    console.log('--- Unhandled Error Code ---')
    console.log(error)
  }

  return error.message
}
