import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Category name is required"],
      unique: true,
    },
    imageUrl: {
      type: String,
      default:
        "https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1faae.png",
    },
    quantity: {
      type: Number,
      required: [true, "avaliable quanity is required"],
    },
  },
  {
    toJSON: { versionKey: false },
  }
);

const Category = mongoose.model("Category", categorySchema);

export default Category;
