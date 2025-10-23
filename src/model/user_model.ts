import crypto from "crypto";
import bcrypt from "bcryptjs";
import * as mongoose from "mongoose";

type Query = mongoose.Query<IUser, IUser>;

export type Role = "client" | "service_provider" | "admin";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  name: string;
  email: string;
  role: Role;
  photo?: string;
  phone?: string;
  dob?: string;
  state?: string;
  town?: string;
  houseAddress?: string;
  shortBio?: string;
  services?: string[];
  otherServices?: string;
  password?: string;
  active?: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetExpires?: string;

  checkPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
}

const userSchema = new mongoose.Schema<IUser>(
  {
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
    phone: String,
    state: String,
    town: String,
    houseAddress: String,
    shortBio: String,
    otherServices: String,
    services: [String],
    dob: Date,
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
    passwordResetExpires: Date,
  },
  {
    toJSON: {
      versionKey: false,
      transform(_, ret) {
        delete ret.password;
        delete ret.active;
        return ret;
      },
    },
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  this.password = await bcrypt.hash(this.password!, 12);

  next();
});

userSchema.pre("save", function (next) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);

  return next();
});

userSchema.pre<Query>(/^find/, function (next) {
  this.find({ active: { $ne: false } });

  next();
});

userSchema.methods.checkPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

userSchema.methods.changePasswordAfter = function (jwtTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;

    return changedTimestamp > jwtTimestamp;
  }

  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");

  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);

  return resetToken;
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
