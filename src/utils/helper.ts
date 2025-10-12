import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface AsyncHandler {
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export const catchAsync =
  (fn: AsyncHandler) => (req: Request, res: Response, next: NextFunction) =>
    fn(req, res, next).catch(next);

export const signToken = (id: string) =>
  jwt.sign({ id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as unknown as number,
  });

export const httpStatusCodes = {
  statusOk: 200,
  statusCreated: 201,
  statusNoContent: 204,
  statusBadRequest: 400,
  statusUnauthorized: 401,
  statusForbidden: 403,
  statusNotFound: 403,
  statusInternalServerError: 500,
};
