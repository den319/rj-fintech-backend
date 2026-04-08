import { z } from "zod";

export const userIdParamSchema = z.object({
	userId: z.string().uuid("Invalid user ID format"),
});

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

export const getUserByIdSchema = z.object({
	params: userIdParamSchema,
});

export type UserIdParamType = z.infer<typeof userIdParamSchema>;
export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
export type GetUserByIdType = z.infer<typeof getUserByIdSchema>;
