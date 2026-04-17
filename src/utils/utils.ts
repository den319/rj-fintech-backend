import { v7 as uuidv7 } from "uuid";
import crypto from "crypto";
import { Env } from "../config/env.config";

export const generateUUID = () => uuidv7();

const algorithm = Env.ENCRYPTION_ALGORITHM;
const key = crypto.createHash("sha256").update(String(Env.JWT_SECRET)).digest(); // 32 bytes

// to encrypt version
export const encrypt = (text: string) => {
	const iv = crypto.randomBytes(12);

	const cipher = crypto.createCipheriv(algorithm, key, iv) as crypto.CipherGCM;

	const encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);

	const tag = cipher.getAuthTag();

	return Buffer.concat([iv, tag, encrypted]).toString("base64");
};

// to decrypt version
export const decrypt = (data: string) => {
	const bData = Buffer.from(data, "base64");

	const iv = bData.subarray(0, 12);
	const tag = bData.subarray(12, 28);
	const text = bData.subarray(28);

	const decipher = crypto.createDecipheriv(algorithm, key, iv) as crypto.DecipherGCM;
	decipher.setAuthTag(tag);

	const decrypted = Buffer.concat([decipher.update(text), decipher.final()]);

	return decrypted.toString("utf8");
};

/**
 * Calculates duration between a start time and now.
 * @param start - The starting BigInt timestamp
 * @returns Object containing time in milliseconds and seconds
 */
export const calculateDuration = (start: bigint) => {
  const end = process.hrtime.bigint();
  const nanoseconds = end - start;
  
  // Convert nanoseconds (BigInt) to milliseconds (Number)
  // 1ms = 1,000,000ns
  const durationMs = Number(nanoseconds) / 1_000_000;
  
  return {
    ms: durationMs.toFixed(3), // e.g., "12.450"
    s: (durationMs / 1000).toFixed(6),
    raw: nanoseconds
  };
};
