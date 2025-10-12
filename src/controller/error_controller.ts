import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";
import { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import AppError from "../utils/app_error";
import { httpStatusCodes } from "../utils/helper";
import { MongoServerError } from "mongodb";

export const globalErrorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || httpStatusCodes.statusInternalServerError;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDevelopment(err, res);
  } else {
    let error = {
      ...err,
      name: err.name,
      message: err.message,
    };

    if (err.name === "CastError")
      error = handleCastError(error as unknown as Error.CastError);
    if (err.name === "MongoServerError")
      error = handleDuplicateFieldError(error as unknown as MongoServerError);
    if (err.name === "ValidatorError")
      error = handleValidationError(error as unknown as Error.ValidationError);
    if (err.name === "JsonWebTokenError")
      error = handleJWTError(error as unknown as JsonWebTokenError);
    if (err.name === "TokenExpiredError")
      error = handleJWTExpiredError(error as unknown as TokenExpiredError);

    sendErrorProduction(error, res);
  }

  next();
};

function handleCastError(err: Error.CastError) {
  const message = `Invalid ${err.path}:${err.value}`;

  return new AppError(message, httpStatusCodes.statusBadRequest);
}

function handleDuplicateFieldError(err: MongoServerError) {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];
  const message = `Duplicate field value for (${field}: ${value}). Please use another value.`;
  return new AppError(message, httpStatusCodes.statusBadRequest);
}

function handleValidationError(err: Error.ValidationError) {
  const errrors = Object.values(err.errors).map((err) => err.message);
  const message = `Invalid input data: ${errrors.join(".")}`;

  return new AppError(message, httpStatusCodes.statusBadRequest);
}

function handleJWTError(err: JsonWebTokenError) {
  return new AppError(
    "Invalid token. Please login again",
    httpStatusCodes.statusUnauthorized
  );
}

function handleJWTExpiredError(err: TokenExpiredError) {
  return new AppError(
    "Your token has expired. Please login again",
    httpStatusCodes.statusUnauthorized
  );
}

function sendErrorDevelopment(err: AppError, res: Response) {
  res.status(err.statusCode).json({
    status: err.statusCode,
    error: err,
    message: err.message,
    stack: err.stack,
  });
}

function sendErrorProduction(err: AppError, res: Response) {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error("Error 💥", err);

    res.status(err.statusCode).json({
      status: "error",
      message: "Something went wrong",
    });
  }
}
