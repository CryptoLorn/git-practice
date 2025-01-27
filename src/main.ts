import express, { NextFunction, Request, Response } from "express";
import * as mongoose from "mongoose";

import { config } from "./configs/config";
import { ApiError } from "./errors/api.error";
import { authRouter } from "./routers/auth.router";
import { userRouter } from "./routers/user.router";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/users", userRouter);
app.use("/auth", authRouter);

app.use(
  "*",
  (err: ApiError, req: Request, res: Response, next: NextFunction) => {
    const message = err.message ?? "Something went wrong";
    const status = err.status ?? 500;
    res.status(status).json({ status, message });
  },
);

app.listen(config.port, async () => {
  await mongoose.connect(config.mongoUri);
  console.log(`Server has been started on port ${config.port}`);
});
