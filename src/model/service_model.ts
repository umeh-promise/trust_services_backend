import mongoose from "mongoose";

type Query = mongoose.Query<IService, IService>;

export interface IService extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  imageUrl: string;
  description: string;
  rating: number;
  price: number;
  reviewCount: number;
  category: mongoose.Types.ObjectId;
  provider?: mongoose.Types.ObjectId;
}

const serviceSchema = new mongoose.Schema<IService>(
  {
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
      set: (val: number) => Math.round(val * 10) / 10,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Service must belong to a category"],
    },
    price: {
      type: Number,
      required: [true, "Service must have a price"],
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    toJSON: {
      virtuals: true,
      versionKey: false,
    },
    toObject: { virtuals: true },
  }
);

serviceSchema.pre<Query>(/^find/, function (next) {
  this.populate({
    path: "provider",
    select: "-_id -role",
  }).populate({
    path: "category",
    select: "-_id",
  });

  next();
});

const Service = mongoose.model<IService>("Service", serviceSchema);

export default Service;
