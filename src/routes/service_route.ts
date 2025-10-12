import express from "express";
import * as Services from "../controller/service_controller";
import { protect, restrictTo } from "../controller/auth_controller";

const router = express.Router();

router
  .route("/")
  .post(protect, restrictTo("service_provider", "admin"), Services.createOne)
  .get(Services.getAll);

export default router;
