import { useState, useEffect } from 'react'

const SECONDS_PER_DAY = 86400
const WEEK_IN_SECONDS = 7 * SECONDS_PER_DAY
const MONTH_IN_SECONDS = 30 * SECONDS_PER_DAY

export const useJobsFilter = ({ data, filters }) => {
  const [filteredJobs, setFilteredJobs] = useState([])

  const filterByPostedDate = (posted, filtered) => {
    if (!posted) return filtered

    // NOTE: We should divide by 1000, because blockchain returns timestamps without milliseconds
    const today = Date.now() / 1000

    switch (posted) {
      case 'last_week': {
        filtered = filtered.filter(
          (job) => today - job.createdAt < WEEK_IN_SECONDS
        )

        break
      }

      case 'last_month': {
        filtered = filtered.filter(
          (job) => today - job.createdAt < MONTH_IN_SECONDS
        )

        break
      }
    }

    return filtered
  }

  const filterByCategory = (category, filtered) => {
    if (!category) return filtered
    if (category === 'all') return filtered

    return filtered.filter((jobs) => jobs.categoryCode === category)
  }

  const filterByApplicationsCount = (applicationsCount, filtered) => {
    if (!applicationsCount) return filtered

    switch (applicationsCount) {
      case 'zero': {
        filtered = filtered.filter((jobs) => jobs.applicationsCount === 0)
        break
      }
      case 'not_zero': {
        filtered = filtered.filter((jobs) => jobs.applicationsCount > 0)
        break
      }
    }

    return filtered
  }

  useEffect(() => {
    if (!data) return

    let filtered = data

    filtered = filterByPostedDate(filters.posted, filtered)
    filtered = filterByCategory(filters.category, filtered)
    filtered = filterByApplicationsCount(filters.applicationsCount, filtered)

    setFilteredJobs(filtered)
  }, [data, filters])

  return filteredJobs
}
