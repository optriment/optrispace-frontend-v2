import { useEffect, useRef } from 'react'

// NOTE: From https://blog.bitsrc.io/polling-in-react-using-the-useinterval-custom-hook-e2bcefda4197
export function useInterval(callback, delay) {
  const savedCallback = useRef()

  useEffect(() => {
    savedCallback.current = callback
  }, [callback])

  useEffect(() => {
    function tick() {
      savedCallback.current()
    }

    if (delay !== null) {
      const id = setInterval(tick, delay)
      return () => {
        clearInterval(id)
      }
    }
  }, [callback, delay])
}
