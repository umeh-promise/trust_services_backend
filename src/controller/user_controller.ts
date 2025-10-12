import { NextFunction, Request, Response } from "express";
import User, { IUser } from "../model/user_model";
import AppError from "../utils/app_error";
import * as handlers from "../utils/handlers";
import { catchAsync, httpStatusCodes } from "../utils/helper";

export const getMe = (req: Request, res: Response, next: NextFunction) => {
  req.params.id = String(req.user._id);
  next();
};

export const updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password) {
    return next(
      new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
    );
  }

  const {
    role,
    services,
    dob,
    phone,
    state,
    town,
    houseAddress,
    shortBio,
    otherServices,
  } = req.body;

  const filteredPayload = {
    role: role === "admin" ? "client" : role,
    services,
    dob,
    phone,
    state,
    town,
    houseAddress,
    shortBio,
    otherServices,
  };

  const updatedUser = await User.findByIdAndUpdate(
    req.user._id,
    filteredPayload,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!updatedUser) {
    return next(
      new AppError("Unauthorized access", httpStatusCodes.statusUnauthorized)
    );
  }

  res.status(httpStatusCodes.statusOk).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(httpStatusCodes.statusNoContent).json({
    status: "success",
    data: null,
  });
};

export const getUser = handlers.getOne<IUser>(User);
export const getAllUsers = handlers.getAll<IUser>(User);
