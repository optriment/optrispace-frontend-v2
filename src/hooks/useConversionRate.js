import { useEffect, useState } from 'react'
const AVG_PRICE_API_URL =
  'https://api.binance.com/api/v3/avgPrice?symbol=BNBBUSD'

export const useConversionRate = () => {
  const [conversionRate, setConversionRate] = useState(0)

  useEffect(() => {
    fetch(AVG_PRICE_API_URL)
      .then((res) => res.json())
      .then((data) => {
        setConversionRate(data.price)
      })
      .catch(() => {
        setConversionRate(0)
      })
  }, [])

  return conversionRate
}
