import { Client } from "@notionhq/client";
import {
	type NotionBlock,
	type NotionBlockChildren,
	type NotionBlockTree,
	notionBlockChildrenSchema,
	notionBlockSchema,
	notionBlockTreeSchema,
} from "./model.ts";

export const notion = new Client({
	auth: process.env.NOTION_AUTH_TOKEN,
});

/**
 * Fetches a single Notion block by its ID.
 *
 * @param blockId - The ID of the Notion block to fetch.
 * @returns A Promise that resolves to the fetched Notion block.
 *
 * @throws Will throw an error if the block ID is invalid or the block cannot be found.
 *
 * @remarks
 * This function uses the Notion API to retrieve a single block by its ID.
 * The returned block is parsed using the `notionBlockSchema` to ensure it conforms to the expected structure.
 *
 * @example
 * ```typescript
 * const blockId = "your_block_id";
 * const block = await fetchBlock(blockId);
 * console.log(block);
 * ```
 */
export async function fetchBlock(blockId: string): Promise<NotionBlock> {
	const response = await notion.blocks.retrieve({ block_id: blockId });
	return notionBlockSchema.parse(response);
}

/**
 * Fetches the children of a Notion block by its ID recursively.
 *
 * @param blockId - The ID of the Notion block to fetch children for.
 * @returns A Promise that resolves to the fetched Notion block children in a tree-like structure.
 *
 * @throws Will throw an error if the block ID is invalid or the block does not have children.
 *
 * @remarks
 * This function uses the Notion API to retrieve the children of a single block by its ID recursively.
 * The returned children are parsed using the `notionBlockChildrenSchema` to ensure they conform to the expected structure.
 *
 * @example
 * ```typescript
 * const blockId = "your_block_id";
 * const blockChildren = await fetchBlockWithChildren(blockId);
 * console.log(blockChildren);
 * ```
 */
export async function fetchBlockWithChildren(
	blockId: string,
): Promise<NotionBlockChildren> {
	const response = await notion.blocks.children.list({
		block_id: blockId,
	});

	return notionBlockChildrenSchema.parse(response);
}

/**
 * Fetches a Notion block and its children recursively by their IDs.
 *
 * @param blockId - The ID of the Notion block to fetch.
 * @returns A Promise that resolves to the fetched Notion block and its children in a tree-like structure.
 *
 * @throws Will throw an error if the block ID is invalid or the block does not have children.
 *
 * @remarks
 * This function uses the Notion API to retrieve a single block and its children by their IDs recursively.
 * The returned block and its children are parsed using the `notionBlockSchema` and `notionBlockChildrenSchema` respectively,
 * to ensure they conform to the expected structure.
 *
 * @example
 * ```typescript
 * const blockId = "your_block_id";
 * const blockTree = await fetchBlockTree(blockId);
 * console.log(blockTree);
 * ```
 */
export async function fetchBlockTree(
	blockId: string,
): Promise<NotionBlockTree> {
	const [block, childrenResponse] = await Promise.all([
		notion.blocks.retrieve({ block_id: blockId }),
		notion.blocks.children.list({ block_id: blockId }),
	]);

	const children = await Promise.all(
		childrenResponse.results.map((child) => fetchBlockTree(child.id)),
	);

	const blockWithChildren = {
		...block,
		children: children.length > 0 ? children : undefined,
	};

	return notionBlockTreeSchema.parse(blockWithChildren);
}
