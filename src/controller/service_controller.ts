import Service from "../model/service_model";
import { catchAsync, httpStatusCodes } from "../utils/helper";

export const getAll = catchAsync(async (req, res, next) => {
  const services = await Service.find();

  res.status(httpStatusCodes.statusOk).json({
    status: "success",
    data: {
      services,
      total: services.length,
    },
  });
});

export const createOne = catchAsync(async (req, res, next) => {
  const newService = await Service.create(req.body);

  res.status(httpStatusCodes.statusCreated).json({
    status: "success",
    data: {
      data: newService,
    },
  });
});
