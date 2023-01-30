import { useEffect, useState } from 'react'

// NOTE: https://github.com/vercel/next.js/issues/3303
export const useHasMounted = () => {
  const [hasMounted, setHasMounted] = useState(false)

  useEffect(() => {
    setHasMounted(true)
  }, [])

  return hasMounted
}
