import {createFileRoute} from '@tanstack/react-router'
import {useState} from "react";
import {useQuery} from "@tanstack/react-query";
import {api} from "../../lib/api.ts";

export const Route = createFileRoute('/')({
    component: Index,
})

async function getTotalSpent() {
    const res = await api.expenses["total-spent"].$get();

    if (!res.ok) {
        throw new Error('Error')
    }

    return await res.json()
}

function Index() {
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
