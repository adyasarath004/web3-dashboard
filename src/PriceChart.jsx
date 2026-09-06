// src/PriceChart.jsx
//
// This component is self-contained: it fetches its own data with a plain
// useEffect + useState (no Redux needed here, since this data isn't tied
// to the connected wallet — it's just general market data).

import { useEffect, useState } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

function PriceChart() {
  const [priceData, setPriceData] = useState([])
  const [status, setStatus] = useState('idle') // idle | loading | succeeded | failed
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadPrices() {
      setStatus('loading')
      try {
        // CoinGecko: get ETH price history for the last 7 days, in USD
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=7'
        )
        const data = await response.json()

        if (!data.prices) {
          throw new Error('Unexpected response from CoinGecko')
        }

        // data.prices is an array of [timestamp, price] pairs.
        // Recharts wants an array of objects instead, so we transform it.
        const formatted = data.prices.map(([timestamp, price]) => ({
          date: new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          }),
          price: Number(price.toFixed(2)),
        }))

        setPriceData(formatted)
        setStatus('succeeded')
      } catch (err) {
        setError(err.message)
        setStatus('failed')
      }
    }

    loadPrices()
  }, [])

  if (status === 'loading') return <p>Loading price chart...</p>
  if (status === 'failed') return <p>Error loading chart: {error}</p>

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={priceData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={['auto', 'auto']} />
        <Tooltip />
        <Line type="monotone" dataKey="price" stroke="#8884d8" dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default PriceChart