import mongoose from "mongoose";

const NotificationSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    target: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: ["REQUEST", "FOLLOW", "TAG", "LIKE", "COMMENT", "GENERAL"],
      default: "GENERAL",
    },
    message: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["RECEIVED", "READ"],
      default: "RECEIVED",
    },
  },
  { timestamps: true }
);

NotificationSchema.index({ target: 1, createdAt: -1 });

const Notification = mongoose.model("Notification", NotificationSchema);
export default Notification;
