import { Model, PopulateOptions, Schema } from "mongoose";
import { catchAsync, httpStatusCodes } from "./helper";
import AppError from "./app_error";
import ApiFeatures from "./api_features";

export const getAll = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const features = new ApiFeatures<T>(Model.find(), req.query)
      .filter()
      .sort()
      .limitFields()
      .paginate();

    const docs = await features.query;

    res.status(httpStatusCodes.statusOk).json({
      status: "success",
      data: {
        docs,
        total: docs.length,
      },
    });
  });

export const getOne = <T>(Model: Model<T>, options?: PopulateOptions) =>
  catchAsync(async (req, res, next) => {
    let query = Model.findById(req.params.id);
    if (options) query = query.populate(options);

    const doc = await query;

    if (!doc) {
      return next(
        new AppError(
          "No document found with this id",
          httpStatusCodes.statusNotFound
        )
      );
    }

    res.status(httpStatusCodes.statusOk).json({
      status: "success",
      data: {
        doc,
      },
    });
  });

export const createOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const newItem = await Model.create(req.body);

    res.status(httpStatusCodes.statusCreated).json({
      status: "success",
      data: {
        data: newItem,
      },
    });
  });

export const updateOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!doc) {
      return next(
        new AppError(
          "No document found with this id",
          httpStatusCodes.statusNotFound
        )
      );
    }

    res.status(httpStatusCodes.statusOk).json({
      status: "success",
      data: {
        data: doc,
      },
    });
  });

export const deleteOne = <T>(Model: Model<T>) =>
  catchAsync(async (req, res, next) => {
    const doc = await Model.findByIdAndDelete(req.params.id);

    if (!doc) {
      return next(
        new AppError(
          "No document found with this id",
          httpStatusCodes.statusNotFound
        )
      );
    }

    res.status(httpStatusCodes.statusNoContent).json({
      status: "success",
      data: {
        data: null,
      },
    });
  });
