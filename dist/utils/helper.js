"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatusCodes = exports.signToken = exports.catchAsync = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
exports.catchAsync = catchAsync;
const signToken = (id) => jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
});
exports.signToken = signToken;
exports.httpStatusCodes = {
    statusOk: 200,
    statusCreated: 201,
    statusNoContent: 204,
    statusBadRequest: 400,
    statusUnauthorized: 401,
    statusForbidden: 403,
    statusNotFound: 403,
    statusInternalServerError: 500,
};
