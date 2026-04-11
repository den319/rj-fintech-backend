import { getEnv } from "../utils/getEnv";

export const Env = {
	NODE_ENV: getEnv("NODE_ENV", "development"),
	PORT: getEnv("PORT", "8000"),
	DATABASE_URL: getEnv(
		"DATABASE_URL",
		"postgresql://username:password@localhost:5432/postgres?schema=public"
	),
	JWT_SECRET: getEnv("JWT_SECRET", "secret"),
	JWT_EXPIRES_IN: getEnv("JWT_EXPIRES_IN", "60m"),
	JWT_REFRESH_SECRET: getEnv("JWT_REFRESH_SECRET", "refresh-secret"),
	JWT_REFRESH_EXPIRES_IN: getEnv("JWT_REFRESH_EXPIRES_IN", "60m"),
	FRONTEND_ORIGIN: getEnv("FRONTEND_ORIGIN", "http://localhost:5173"),
	RATE_LIMIT_MAX: getEnv("RATE_LIMIT_MAX", "100"),
	RATE_LIMIT_WINDOW: getEnv("RATE_LIMIT_WINDOW", "60000"),
	ENCRYPTION_ALGORITHM: getEnv("ENCRYPTION_ALGORITHM", "aes-256-gcm"),
} as const;
