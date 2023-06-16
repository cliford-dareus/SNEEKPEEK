import mongoose from "mongoose";
import { INotification } from "../types/typing";

const NotificationSchema = new mongoose.Schema(
  {
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    target: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    type: { type: String },
  },
  { timestamps: true }
);

const Notification = mongoose.model<INotification>(
  "Notification",
  NotificationSchema
);
export default Notification;
