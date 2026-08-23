import { FormEvent, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import { BsEmojiSmile } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Button from "../../components/UI/Button";
import BackButton from "../../components/UI/BackButton";
import SideContent from "../../components/SideContent";
import { socket, socketConnect } from "../../lib/socket/config";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { IAuthInitialState } from "../../utils/types/types";
import {
  useAddNewMessageMutation,
  useGetMessagesQuery,
  useUpdateMessageStatusMutation,
} from "../../features/api/message";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { clearMessagesFrom } from "../../features/slice/inboxSlice";
import { useGetConversationsQuery } from "../../features/api/conversations";
import toast from "react-hot-toast";

interface IMessage {
  status: string | undefined;
  content: string | undefined;
  sender: { _id: string | undefined; username: string | undefined };
}

const Index = () => {
  const { id, name } = useParams();
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser) as IAuthInitialState;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<IMessage>();
  const recieverRef = useRef<HTMLInputElement>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);

  const [sendMessage] = useAddNewMessageMutation();
  const [updateStatus] = useUpdateMessageStatusMutation();
  const { data: conversations } = useGetConversationsQuery({});
  const { data, refetch } = useGetMessagesQuery(id);

  const scrollRef = useRef<HTMLDivElement>(null);

  // Clear navbar badge for this conversation partner
  useEffect(() => {
    if (name) {
      dispatch(clearMessagesFrom({ username: name }));
    }
  }, [name, dispatch]);

  useEffect(() => {
    if (data?.message?.messages === undefined) {
      setMessages([]);
    } else {
      setMessages(data?.message?.messages);
    }
  }, [data]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!input.trim() || !id) return;

    const channel = conversations?.conversation?.find((u: any) => u._id === id);
    if (!channel) {
      toast.error("Conversation not found");
      return;
    }

    const receiverInfo = channel.users.filter(
      (u: any) => u._id !== user.user?.userId
    );
    if (!receiverInfo[0]) return;

    const text = input.trim();

    socket.emit("private_message", {
      sender: { username: user?.user?.username, userId: user?.user?.userId },
      reciever: {
        username: receiverInfo[0].username,
        userId: receiverInfo[0]._id,
      },
      message: text,
    });

    const msg = {
      status: "DELIVERED",
      content: text,
      sender: user.user?.userId,
    };

    const newmsg = {
      status: "DELIVERED",
      content: text,
      sender: { _id: user.user?.userId, username: user.user?.username },
    };

    try {
      await sendMessage({ msg, conversationId: id });
      setMessages((prev) => [...prev, newmsg]);
      setInput("");
    } catch {
      toast.error("Could not send message");
    }
  };

  const handleEmoji = (emoji: EmojiClickData) => {
    setInput((prev) => prev + emoji.emoji);
  };

  // Only append messages from the open thread (global listener handles toasts elsewhere)
  useEffect(() => {
    const handler = async ({
      sender,
      reciever,
      message,
    }: {
      sender: { _id?: string; username: string; userId?: string };
      reciever: { username: string };
      message: string;
    }) => {
      if (
        reciever.username === user?.user?.username &&
        sender.username === name
      ) {
        setArrivalMessage({
          status: "DELIVERED",
          content: message,
          sender: {
            _id: sender._id || sender.userId,
            username: sender.username,
          },
        });
        if (id) {
          await updateStatus({ channelId: id, status: "READ" });
        }
        dispatch(clearMessagesFrom({ username: sender.username }));
      }
    };

    socket.on("private_message", handler);
    return () => {
      socket.off("private_message", handler);
    };
  }, [user?.user?.username, name, id, updateStatus, dispatch]);

  useEffect(() => {
    if (arrivalMessage) {
      setMessages((prev) => [...prev, arrivalMessage]);
    }
  }, [arrivalMessage]);

  useEffect(() => {
    refetch();
    socketConnect(user);
    recieverRef.current?.focus();
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ChatLayout>
      <PageContainer style={{ display: "flex", flexDirection: "column" }}>
        <PageTitle
          style={{ display: "flex", alignItems: "center", gap: "1em" }}
        >
          <BackButton />
          <h1>{name}</h1>
        </PageTitle>

        <ChatBody>
          <MessageList>
            {messages?.map((m, index) => (
              <ChatBubble
                key={`${m.content}-${index}`}
                fromSelf={m?.sender?._id == user.user?.userId}
                ref={index === messages.length - 1 ? scrollRef : undefined}
              >
                <p>{m.content}</p>
              </ChatBubble>
            ))}
          </MessageList>

          <MessageInputContainer>
            <Form onSubmit={handleSendMessage}>
              <Input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Text message"
                ref={recieverRef}
              />
              <span onClick={() => setOpenEmoji(!openEmoji)}>
                <BsEmojiSmile />
              </span>
              <Button label="Send" isLoading={false} color={true} />
            </Form>
          </MessageInputContainer>

          {openEmoji && (
            <EmojiContainer>
              <EmojiPicker onEmojiClick={handleEmoji} />
            </EmojiContainer>
          )}
        </ChatBody>
      </PageContainer>

      <SideContent>
        <SideHeading>Chat</SideHeading>
        <SideFriendContainer>
          <p style={{ color: "var(--txt--muted)", fontSize: "0.9rem" }}>
            Messaging @{name}
          </p>
        </SideFriendContainer>
      </SideContent>
    </ChatLayout>
  );
};

export default Index;

const ChatLayout = styled.div`
  flex: 1;
  display: flex;
  gap: 1em;
  overflow: hidden;
  min-width: 0;
`;

const ChatBody = styled.div`
  flex: 1;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: 0;
`;

const MessageList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1em;
  display: flex;
  flex-direction: column;
`;

const Input = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  flex: 1;
  color: var(--txt--color-100);
  padding: 0 0.5em;
  font-size: 1rem;
`;

export const MessageInputContainer = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 0.35em 1em;
  display: flex;
  align-items: center;
  border-radius: var(--radius-md);
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  margin: 0 0 0.5em;
`;

const Form = styled.form`
  display: flex;
  align-items: center;
  flex: 1;
  gap: 0.35em;

  span {
    display: flex;
    align-items: center;
    font-size: 1.25rem;
    cursor: pointer;
    color: var(--light--color-400);
  }
`;

const EmojiContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 20;
`;

const SideFriendContainer = styled.div`
  margin-top: 0.5em;
`;

const SideHeading = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5em;
`;

interface IProps {
  fromSelf: boolean;
}

const ChatBubble = styled.div<IProps>`
  max-width: 70%;
  word-wrap: break-word;
  padding: 0.55em 1em;
  margin-top: 0.45em;
  align-self: ${(props) => (props.fromSelf ? "flex-end" : "flex-start")};
  background: ${(props) =>
    props.fromSelf ? "var(--primary--color-400)" : "var(--dark--color-750)"};
  color: white;
  border-radius: 1.25em;
  border-bottom-right-radius: ${(props) =>
    props.fromSelf ? "0.35em" : "1.25em"};
  border-bottom-left-radius: ${(props) =>
    props.fromSelf ? "1.25em" : "0.35em"};
`;
