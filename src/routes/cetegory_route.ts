import express from "express";
import * as Category from "../controller/category_controller";

const router = express.Router();

router.route("/").post(Category.createOne).get(Category.getAll);

export default router;
