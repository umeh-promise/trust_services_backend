"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "User name is required"],
        min: [2, "User name must be greater than 2 characters"],
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        min: [2, "Email must be greater than 2 characters"],
        unique: true,
        lowercase: true,
    },
    role: {
        type: String,
        enum: ["client", "service_provider", "admin"],
        default: "client",
    },
    photo: String,
    password: {
        type: String,
        required: [true, "Password is required"],
        minLength: 6,
    },
    active: {
        type: Boolean,
        select: false,
        default: true,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: String,
});
const User = mongoose_1.default.model("User", userSchema);
exports.default = User;
