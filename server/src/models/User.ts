import bcrypt from "bcrypt";
import mongoose, { Schema } from "mongoose";
import validator from "validator";
import { IUser, IUserMethod, IUserModel } from "../types/models.type";

const UserSchema = new Schema<IUser, IUserModel, IUserMethod>(
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
    password: {
      type: String,
      require: true,
    },
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

export const User = mongoose.model<IUser>("User", UserSchema);
