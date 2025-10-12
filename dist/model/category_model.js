"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Category name is required"],
        unique: true,
    },
    imageUrl: {
        type: String,
        default: "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1faae.png",
    },
    quantity: {
        type: Number,
        required: [true, "avaliable quanity is required"],
    },
});
const Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
