import mongoose from "mongoose";
import { IMessage } from "../types/typing";

const MessagesSchema = new mongoose.Schema(
  {
    channelId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
      required: true
    },
    messages: {
      type: [
        {
          status: String,
          content: String,
          sender: {
            type: mongoose.Types.ObjectId,
            ref: "User",
          },
        },
      ],
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model<IMessage>("Messages", MessagesSchema);
export default Messages;
