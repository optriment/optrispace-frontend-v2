import { useState, useEffect } from 'react'

export const useContractsFilter = ({ data, filters }) => {
  const [filteredContracts, setFilteredContracts] = useState([])

  const filterByStatus = (status = 'active', filtered) => {
    if (status === 'all') return filtered

    if (status === 'active') {
      return filtered.filter((contract) => contract.status !== 'closed')
    }

    return filtered.filter((contract) => contract.status === status)
  }

  useEffect(() => {
    if (!data) return

    let filtered = data

    filtered = filterByStatus(filters.status, filtered)

    setFilteredContracts(filtered)
  }, [data, filters])

  return filteredContracts
}
