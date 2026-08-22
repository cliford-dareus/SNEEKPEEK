import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { IUser, IUserMethod, UserModel } from "../types/typing";

const UserSchema = new Schema<IUser, UserModel, IUserMethod>(
  {
    name: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 20,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      minlength: 4,
      maxlength: 20,
      trim: true,
      lowercase: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email..."],
    },
    image: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
      select: false,
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
    followersLength: { type: Number, default: 0 },
    followingsLength: { type: Number, default: 0 },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password!, salt);
});

UserSchema.methods.comparePassword = async function (password: string) {
  const isMatch = await bcrypt.compare(password, this.password);
  return isMatch;
};

export const User = mongoose.model<IUser, UserModel>("User", UserSchema);
