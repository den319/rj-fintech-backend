import { v7 as uuidv7 } from "uuid";
import crypto from "crypto";
import { Env } from "../config/env.config";
import { Response } from "express";


export const generateUUID = () => uuidv7();


export const generateToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

const algorithm = Env.ENCRYPTION_ALGORITHM;
const key = Buffer.from(Env.JWT_SECRET!, "hex"); // 32 bytes

// to encrypt version
export const encrypt = (text: string) => {
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algorithm, key, iv) as crypto.CipherGCM;

  const encrypted = Buffer.concat([
    cipher.update(text, "utf8"),
    cipher.final(),
  ]);

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

  const decrypted = Buffer.concat([
    decipher.update(text),
    decipher.final(),
  ]);

  return decrypted.toString("utf8");
};