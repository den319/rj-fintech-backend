import type { UserMaster } from "./generated/prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: UserMaster;
    }
  }
}

export {};