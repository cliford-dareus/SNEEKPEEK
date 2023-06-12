import mongoose from "mongoose";
import { IConversation } from "../types/typing";

const ConversationSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    lastmessage: {
      type: String,
    },
  },
  { timestamps: true }
);

const Conversation = mongoose.model<IConversation>(
  "Conversation",
  ConversationSchema
);
export default Conversation;
