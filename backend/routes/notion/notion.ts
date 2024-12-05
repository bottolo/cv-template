import { Hono } from "hono";
import { fetchBlock, fetchBlockTree, fetchBlockWithChildren } from "./utils.ts";

export const notionRoute = new Hono()
	.get("/blocks/:blockId", async (c) => {
		const response = await fetchBlock(c.req.param("blockId"));

		return c.json(response);
	})
	.get("/blocks/:blockId/children", async (c) => {
		const response = await fetchBlockWithChildren(c.req.param("blockId"));

		return c.json(response);
	})
	.get("/blocks/:blockId/tree", async (c) => {
		const response = await fetchBlockTree(c.req.param("blockId"));
		return c.json(response);
	});
