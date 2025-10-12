import Category from "../model/category_model";
import { catchAsync, httpStatusCodes } from "../utils/helper";

export const createOne = catchAsync(async (req, res, next) => {
  const category = await Category.create(req.body);

  res.status(httpStatusCodes.statusCreated).json({
    status: "success",
    data: {
      category,
    },
  });
});

export const getAll = catchAsync(async (req, res, next) => {
  const categories = await Category.find();

  res.status(httpStatusCodes.statusOk).json({
    status: "success",
    data: {
      categories,
      total: categories.length,
    },
  });
});
