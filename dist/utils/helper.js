"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.httpStatusCodes = exports.catchAsync = void 0;
const catchAsync = (fn) => (req, res, next) => fn(req, res, next).catch(next);
exports.catchAsync = catchAsync;
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
