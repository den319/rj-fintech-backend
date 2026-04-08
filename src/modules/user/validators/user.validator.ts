import { z } from "zod";

export const paginationQuerySchema = z.object({
	page: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 1)),
	limit: z
		.string()
		.optional()
		.transform((val) => (val ? parseInt(val, 10) : 10)),
	sortBy: z.enum(["createdAt", "name", "email"]).optional().default("createdAt"),
	sortOrder: z.enum(["ASC", "DESC"]).optional().default("DESC"),
});

export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
