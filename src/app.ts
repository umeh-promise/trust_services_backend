import express from "express";
import AppError from "./utils/app_error";
import serviceRouter from "./routes/service_route";
import authRouter from "./routes/auth_route";
import categoryRouter from "./routes/cetegory_route";
import userRouter from "./routes/user_route";
import { globalErrorHandler } from "./controller/error_controller";
import { httpStatusCodes } from "./utils/helper";

const app = express();

app.use(express.json({ limit: "10kb" }));

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/services", serviceRouter);
app.use("/api/v1/categories", categoryRouter);

app.all("{/*path}", (req, res, next) =>
  next(
    new AppError(
      `Can't find ${req.originalUrl} on this server`,
      httpStatusCodes.statusNotFound
    )
  )
);

app.use(globalErrorHandler);

export default app;
