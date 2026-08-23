import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export type UnreadMessage = {
  fromUserId: string;
  fromUsername: string;
  preview: string;
  at: number;
};

type InboxState = {
  /** Unread direct messages while user is away from that chat */
  unreadMessages: UnreadMessage[];
  /** Social activity count (follow requests, etc.) */
  unreadSocial: number;
};

const initialState: InboxState = {
  unreadMessages: [],
  unreadSocial: 0,
};

const inboxSlice = createSlice({
  name: "inbox",
  initialState,
  reducers: {
    messageReceived: (
      state,
      action: PayloadAction<{
        fromUserId: string;
        fromUsername: string;
        preview: string;
      }>
    ) => {
      const { fromUserId, fromUsername, preview } = action.payload;
      // Keep one entry per sender; bump to front
      state.unreadMessages = state.unreadMessages.filter(
        (m) => m.fromUserId !== fromUserId && m.fromUsername !== fromUsername
      );
      state.unreadMessages.unshift({
        fromUserId,
        fromUsername,
        preview: preview.slice(0, 80),
        at: Date.now(),
      });
    },
    clearMessagesFrom: (
      state,
      action: PayloadAction<{ username?: string; userId?: string }>
    ) => {
      const { username, userId } = action.payload;
      state.unreadMessages = state.unreadMessages.filter((m) => {
        if (userId && m.fromUserId === userId) return false;
        if (username && m.fromUsername === username) return false;
        return true;
      });
    },
    clearAllMessages: (state) => {
      state.unreadMessages = [];
    },
    setSocialUnread: (state, action: PayloadAction<number>) => {
      state.unreadSocial = Math.max(0, action.payload);
    },
    incrementSocialUnread: (state) => {
      state.unreadSocial += 1;
    },
    clearSocialUnread: (state) => {
      state.unreadSocial = 0;
    },
  },
});

export const {
  messageReceived,
  clearMessagesFrom,
  clearAllMessages,
  setSocialUnread,
  incrementSocialUnread,
  clearSocialUnread,
} = inboxSlice.actions;

export default inboxSlice.reducer;

export const selectUnreadMessageCount = (state: RootState) =>
  state.inbox.unreadMessages.length;

export const selectUnreadMessages = (state: RootState) =>
  state.inbox.unreadMessages;

export const selectSocialUnread = (state: RootState) => state.inbox.unreadSocial;
