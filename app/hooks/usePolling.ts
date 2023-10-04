import { useEffect, useRef } from 'react'

export function usePolling(callback: () => void, interval: number) {
  // run when you need to update
  const timerIdRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const pollingCallback = () => {
      callback()
    }

    const startPolling = () => {
      // pollingCallback(); // To immediately start fetching data
      // Polling every 30 seconds
      timerIdRef.current = setInterval(pollingCallback, interval)
    }

    const stopPolling = () => {
      if (timerIdRef.current) {
        clearInterval(timerIdRef.current)
      }
    }

    startPolling()

    return () => {
      stopPolling()
    }
  }, [callback, interval])
}
