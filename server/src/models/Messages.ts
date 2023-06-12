import mongoose from "mongoose";
import { IMessage } from "../types/typing";

const MessagesSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Types.ObjectId,
      ref: "Conversation",
    },
    messages: {
      type: [],
    },
  },
  { timestamps: true }
);

const Messages = mongoose.model<IMessage>("Messages", MessagesSchema);
export default Messages;
