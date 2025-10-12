"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOne = exports.getAll = void 0;
const service_model_1 = __importDefault(require("../model/service_model"));
const helper_1 = require("../utils/helper");
exports.getAll = (0, helper_1.catchAsync)(async (req, res, next) => {
    const services = await service_model_1.default.find();
    res.status(helper_1.httpStatusCodes.statusOk).json({
        status: "success",
        data: {
            services,
            total: services.length,
        },
    });
});
exports.createOne = (0, helper_1.catchAsync)(async (req, res, next) => {
    const newService = await service_model_1.default.create(req.body);
    res.status(helper_1.httpStatusCodes.statusCreated).json({
        status: "success",
        data: {
            data: newService,
        },
    });
});
