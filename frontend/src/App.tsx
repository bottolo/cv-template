import {useEffect, useState} from 'react'
import './App.css'

function App() {
  const [amount, setAmount] = useState(0)

    useEffect(() => {
        async function fetchTotalSpent() {
            const response = await fetch('/api/expenses/total-spent')
            const data = await response.json()
            setAmount(data.total)
        }

        fetchTotalSpent()
    }, [])

  return (
    <>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setAmount((count) => count + 1)}>
          count is {amount}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
          {amount}
      </p>
    </>
  )
}

export default App
