import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Response, Request } from "express";

import User, { IUser, Role } from "../model/user_model";
import { catchAsync, httpStatusCodes, signToken } from "../utils/helper";
import AppError from "../utils/app_error";

const createSendToken = (user: IUser, statusCode: number, res: Response) => {
  const token = signToken(String(user._id));

  res.status(statusCode).json({
    status: "success",
    data: {
      user,
      token,
    },
  });
};

export const register = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return next(
      new AppError(
        `All Fields: (name, email, password} are required `,
        httpStatusCodes.statusBadRequest
      )
    );
  }

  const newUser = await User.create({
    name,
    email,
    password,
    role: "client",
  });

  createSendToken(newUser, httpStatusCodes.statusCreated, res);
});

export const login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(
      new AppError(
        `All Fields: (email, password) are required `,
        httpStatusCodes.statusBadRequest
      )
    );
  }

  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.checkPassword(password, user.password!))) {
    return next(
      new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
    );
  }

  createSendToken(user, httpStatusCodes.statusOk, res);
});

export const protect = catchAsync(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer")) {
    return next(
      new AppError(
        "Authorization header is malfunctioned",
        httpStatusCodes.statusUnauthorized
      )
    );
  }

  const token = authHeader?.split(" ")[1];

  if (!token) {
    return next(
      new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
    );
  }

  const decodedToken = jwt.verify(
    token,
    process.env.JWT_SECRET as string
  ) as JwtPayload & { id: string };

  const currentUser = await User.findById(decodedToken.id);
  if (!currentUser) {
    return next(
      new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
    );
  }

  req.user = currentUser;
  next();
});

export const restrictTo =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    {
      if (!roles.includes(req.user.role))
        return next(
          new AppError(
            "You don't have permission to perform this action",
            httpStatusCodes.statusForbidden
          )
        );
    }

    next();
  };

export const updatePassword = () =>
  catchAsync(async (req, res, next) => {
    const user = await User.findById(req.user._id).select("+password");

    if (!user) {
      return next(
        new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
      );
    }

    if (!(await user.checkPassword(req.body.password, user.password!))) {
      return next(
        new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
      );
    }

    user.password = req.body.password;
    await user.save();

    createSendToken(user, httpStatusCodes.statusOk, res);
  });

export const forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(
      new AppError(
        "There's no user found with this email address",
        httpStatusCodes.statusNotFound
      )
    );
  }
});
