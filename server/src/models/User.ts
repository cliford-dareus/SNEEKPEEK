import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { IUser, IUserMethod, UserModel } from "../types/typing";

const UserSchema = new Schema<IUser, UserModel, IUserMethod>(
  {
    name: {
      type: String,
      require: true,
      min: 4,
      max: 20,
      trim: true,
    },
    username: {
      type: String,
      require: true,
      unique: true,
      min: 4,
      max: 20,
      trim: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      validate: [validator.isEmail, "Invalid email..."],
    },
    image: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      require: true,
    },
    request: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    followers: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    followings: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    followersLength: { tyoe: Number, default: 0 },
    followingsLength: { tyoe: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password!, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);
