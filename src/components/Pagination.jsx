import React from 'react'
import { Pagination as PaginationComponent } from 'semantic-ui-react'

export const Pagination = ({ totalPages, changePage }) => {
  return (
    <PaginationComponent
      siblingRange={1}
      defaultActivePage={1}
      totalPages={totalPages}
      onPageChange={changePage}
      size="large"
      pointing
      secondary
    />
  )
}
