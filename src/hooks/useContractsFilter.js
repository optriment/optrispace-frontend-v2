import { useState, useEffect } from 'react'

export const useContractsFilter = ({ data, filters }) => {
  const [filteredJobs, setFilteredJobs] = useState([])

  const filterByStatus = (status = 'active', filtered) => {
    if (status === 'all') return filtered

    if (status === 'active') {
      return filtered.filter((job) => job.status !== 'closed')
    }

    return filtered.filter((job) => job.status === status)
  }

  useEffect(() => {
    if (!data) return

    let filtered = data

    filtered = filterByStatus(filters.status, filtered)

    setFilteredJobs(filtered)
  }, [data, filters])

  return filteredJobs
}
