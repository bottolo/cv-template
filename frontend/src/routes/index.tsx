import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { api } from "../../lib/api.ts";

export const Route = createFileRoute("/")({
	component: Index,
});

async function getNotionBlockTree() {
	const res = await api.notion["blocks/:blockId/tree"].$get({
		param: { blockId: "144289d6-7a26-80df-8b85-edc7652a7ccb" },
	});

	if (!res.ok) {
		throw new Error("Error");
	}

	return await res.json();
}

function Index() {
	const { isPending, error, data } = useQuery({
		queryKey: ["get-notion-tree"],
		queryFn: getNotionBlockTree,
	});

	if (isPending) return <p>Loading...</p>;

	if (error) return <p>Error: {error.message}</p>;

	return (
		<>
			<h1>Vite + React</h1>
			<pre>
				{isPending
					? "..."
					: `Obtained ${data.type} with ${data.children.map((c) => c.type)}`}
			</pre>
		</>
	);
}
