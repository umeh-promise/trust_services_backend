"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restrictTo = exports.protect = exports.login = exports.register = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../model/user_model"));
const helper_1 = require("../utils/helper");
const app_error_1 = __importDefault(require("../utils/app_error"));
const createSendToken = (user, statusCode, res) => {
    const token = (0, helper_1.signToken)(String(user._id));
    res.status(statusCode).json({
        status: "success",
        data: {
            user,
            token,
        },
    });
};
exports.register = (0, helper_1.catchAsync)(async (req, res, next) => {
    console.log(req.body);
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
        return next(new app_error_1.default(`All Fields: ${name}, ${email}, ${password}} are required `, helper_1.httpStatusCodes.statusBadRequest));
    }
    const newUser = await user_model_1.default.create({
        name,
        email,
        password,
        role: role === "admin" ? "client" : role,
    });
    createSendToken(newUser, helper_1.httpStatusCodes.statusCreated, res);
});
exports.login = (0, helper_1.catchAsync)(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return next(new app_error_1.default(`All Fields: ${email}, ${password}} are required `, helper_1.httpStatusCodes.statusBadRequest));
    }
    const user = await user_model_1.default.findOne({ email }).select("+password");
    if (!user || !(await user.checkPassword(password, user.password))) {
        return next(new app_error_1.default("Unauthorized access", helper_1.httpStatusCodes.statusUnauthorized));
    }
    createSendToken(user, helper_1.httpStatusCodes.statusOk, res);
});
exports.protect = (0, helper_1.catchAsync)(async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
        return next(new app_error_1.default("Authorization header is malfunctioned", helper_1.httpStatusCodes.statusUnauthorized));
    }
    const token = authHeader?.split(" ")[1];
    if (!token) {
        return next(new app_error_1.default("Unauthorized access", helper_1.httpStatusCodes.statusUnauthorized));
    }
    const decodedToken = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const currentUser = await user_model_1.default.findById(decodedToken.id);
    if (!currentUser) {
        return next(new app_error_1.default("Unauthorized access", helper_1.httpStatusCodes.statusUnauthorized));
    }
    req.user = currentUser;
    next();
});
const restrictTo = (...roles) => (req, res, next) => {
    {
        if (!roles.includes(req.user.role))
            return next(new app_error_1.default("You donot have permission to perform this action", helper_1.httpStatusCodes.statusForbidden));
    }
    next();
};
exports.restrictTo = restrictTo;
