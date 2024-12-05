import {useState} from 'react'
import './App.css'
import {api} from "../lib/api.ts";
import {useQuery} from "@tanstack/react-query";


async function getTotalSpent() {
    const result = await api.expenses["total-spent"].$get()
    if (!result.ok) {
        throw new Error("Failed to fetch total spent")
    }

    return await result.json()
}

function App() {
    const [amount, setAmount] = useState(0)

    const {isPending, error, data} = useQuery({queryKey: ['get-total-spent'], queryFn: getTotalSpent})

    if (isPending) return <p>Loading...</p>

    if (error) return <p>Error: {error.message}</p>

    return (
        <>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setAmount((count) => count + 1)}>
                    count is {amount}
                </button>
            </div>
            <p className="read-the-docs">
                {isPending ? "..." : data.total}
            </p>
        </>
    )
}

export default App
