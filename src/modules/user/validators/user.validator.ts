import { z } from "zod";

export const userIdParamSchema = z.object({
	userId: z.string().uuid("Invalid user ID format"),
});

export const businessUnitIdParamSchema = z.object({
	businessUnitId: z.string().uuid("Invalid business unit ID format"),
});

export const transactionIdParamSchema = z.object({
	transactionId: z.string().uuid("Invalid transaction ID format"),
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

export const getUsersByBusinessUnitSchema = z.object({
	params: businessUnitIdParamSchema,
	query: paginationQuerySchema.optional(),
});

export const getUserTransactionsSchema = z.object({
	params: userIdParamSchema,
	query: paginationQuerySchema.optional(),
});

export const getBusinessUnitTransactionsSchema = z.object({
	params: businessUnitIdParamSchema,
	query: paginationQuerySchema.optional(),
});

export type UserIdParamType = z.infer<typeof userIdParamSchema>;
export type BusinessUnitIdParamType = z.infer<typeof businessUnitIdParamSchema>;
export type PaginationQueryType = z.infer<typeof paginationQuerySchema>;
export type GetUserByIdType = z.infer<typeof getUserByIdSchema>;
export type GetUsersByBusinessUnitType = z.infer<typeof getUsersByBusinessUnitSchema>;
export type GetUserTransactionsType = z.infer<typeof getUserTransactionsSchema>;
export type GetBusinessUnitTransactionsType = z.infer<typeof getBusinessUnitTransactionsSchema>;
