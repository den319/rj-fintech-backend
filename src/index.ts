import "dotenv/config";
import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { Env } from "./config/env.config";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";
import { HTTP_STATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import passport from "passport";
import routes from "./routes";
import http from "http";
import { prisma } from "./config/prismaClient";

import "./config/passport.config";

export const app = express();

const server = http.createServer(app);
app.use(express.json());
app.use(cookieParser());

app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: Env.FRONTEND_ORIGIN,
    credentials: true,
  })
);

app.use(passport.initialize());

app.get(
  "/health",
  asyncHandler(async (req: Request, res: Response) => {
    res.status(HTTP_STATUS.OK).json({
      status: "OK",
      message: "Server is working!",
    });
  })
);

app.use("/api/v1", routes);

app.use(errorHandler);

server.listen(Env.PORT, () => {
  prisma
    .$connect()
    .then(() => {
      console.log("✅ Connected to database");
      console.log(`Server is running on port: ${Env.PORT}`);
      console.log(`\nServer is running in ${Env.NODE_ENV} mode\n`);
    })
    .catch((error) => {
      console.error("❌ Failed to connect to database:", error);
      process.exit(1);
    });
});
