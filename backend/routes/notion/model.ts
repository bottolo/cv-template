import type { JSONObject } from "hono/utils/types";
import z from "zod";

const annotationsSchema = z.object({
	bold: z.boolean().optional().default(true),
	italic: z.boolean().optional().default(true),
	strikethrough: z.boolean().optional().default(true),
	underline: z.boolean().optional().default(true),
	code: z.boolean().optional().default(true),
	color: z.string().optional(),
});

const heading2Schema = z.object({
	object: z.string().optional(),
	rich_text: z.array(
		z
			.object({
				type: z.string().optional(),
				text: z
					.object({
						content: z.string(),
						link: z.union([z.string(), z.null()]).optional(),
					})
					.optional(),
				annotations: annotationsSchema.optional(),
				plain_text: z.string().optional(),
				href: z.union([z.string(), z.null()]).optional(),
			})
			.optional(),
	),
	color: z.string().optional(),
	is_toggleable: z.boolean().optional().default(true),
});

const createdBySchema = z.object({
	object: z.string(),
	id: z.string(),
});

const lastEditedBySchema = z.object({
	object: z.string(),
	id: z.string(),
});

const parentSchema = z.object({
	type: z.string().optional(),
	page_id: z.string().optional(),
});

export const notionBlockSchema = z.object({
	object: z.string(),
	id: z.string(),
	parent: parentSchema.optional(),
	created_time: z.string(),
	last_edited_time: z.string(),
	created_by: createdBySchema,
	last_edited_by: lastEditedBySchema,
	has_children: z.boolean().default(true),
	archived: z.boolean().default(true),
	type: z.string().optional(),
	heading_2: heading2Schema.optional(),
});

export const notionBlockChildrenSchema = z.object({
	object: z.string().optional(),
	results: z.array(notionBlockSchema),
	next_cursor: z.union([z.string(), z.null()]).optional(),
	has_more: z.boolean().optional(),
	block: z.object({}).optional(),
});

export const notionBlockTreeSchema: z.ZodType<JSONObject> = z.lazy(() =>
	notionBlockSchema.extend({
		children: z.array(notionBlockTreeSchema).optional(),
	}),
);

export type NotionBlock = z.infer<typeof notionBlockSchema>;
export type NotionBlockChildren = z.infer<typeof notionBlockChildrenSchema>;
export type NotionBlockTree = z.infer<typeof notionBlockTreeSchema>;
