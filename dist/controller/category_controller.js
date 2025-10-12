"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAll = exports.createOne = void 0;
const category_model_1 = __importDefault(require("../model/category_model"));
const helper_1 = require("../utils/helper");
exports.createOne = (0, helper_1.catchAsync)(async (req, res, next) => {
    const category = await category_model_1.default.create(req.body);
    res.status(helper_1.httpStatusCodes.statusCreated).json({
        status: "success",
        data: {
            category,
        },
    });
});
exports.getAll = (0, helper_1.catchAsync)(async (req, res, next) => {
    const categories = await category_model_1.default.find();
    res.status(helper_1.httpStatusCodes.statusOk).json({
        status: "success",
        data: {
            categories,
            total: categories.length,
        },
    });
});
