"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const service_route_1 = __importDefault(require("./routes/service_route"));
const auth_route_1 = __importDefault(require("./routes/auth_route"));
const cetegory_route_1 = __importDefault(require("./routes/cetegory_route"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "10kb" }));
app.use("/api/v1/services", service_route_1.default);
app.use("/api/v1/auth", auth_route_1.default);
app.use("/api/v1/categories", cetegory_route_1.default);
exports.default = app;
