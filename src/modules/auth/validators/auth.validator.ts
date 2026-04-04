import { z } from "zod";

export const emailSchema = z.string().trim().email("Invalid email!").min(1);

export const passwordSchema = z.string().trim().min(7);

export const registerSchema = z.object({
	name: z.string().trim().min(2),
	email: emailSchema,
	password: passwordSchema,
});

export const loginSchema = z.object({
	email: emailSchema,
	password: passwordSchema,
});

export type RegisterSchemaType = z.infer<typeof registerSchema>;
export type LoginSchemaType = z.infer<typeof loginSchema>;
