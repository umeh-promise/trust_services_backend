"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const serviceSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        requied: [true, "Name is required"],
    },
    imageUrl: String,
    description: {
        type: String,
        required: [true, "Description is required"],
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        set: (val) => Math.round(val * 10) / 10,
        default: 0,
    },
    reviewCount: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "Service must belong to a category"],
    },
    price: {
        type: Number,
        required: [true, "Service must have a price"],
    },
    provider: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "User",
    },
}, {
    toJSON: {
        virtuals: true,
        versionKey: false,
    },
    toObject: { virtuals: true },
});
serviceSchema.pre(/^find/, function (next) {
    this.populate({
        path: "provider",
        select: "-_id -role",
    }).populate({
        path: "category",
        select: "-_id",
    });
    next();
});
const Service = mongoose_1.default.model("Service", serviceSchema);
exports.default = Service;
