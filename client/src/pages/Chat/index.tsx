import styled from "styled-components";
import { useParams } from "react-router-dom";
import { BsEmojiSmile } from "react-icons/bs";
import { useAppSelector } from "../../app/hooks";
import { FormEvent, useEffect, useRef, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Button from "../../components/UI/Button";
import SideContent from "../../components/SideContent";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { socket, socketConnect } from "../../lib/socket/config";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { IAuthInitialState } from "../../utils/types/types";
import {
  useAddNewMessageMutation,
  useGetMessagesQuery,
} from "../../features/api/message";
import { useGetConversationsQuery } from "../../features/api/conversations";

interface IMessage {
  status: string | undefined;
  content: string | undefined;
  sender: { _id: string | undefined; username: string | undefined };
}

const index = () => {
  const { id, name } = useParams();
  const user = useAppSelector(selectCurrentUser) as IAuthInitialState;

  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<IMessage>();
  const recieverRef = useRef<HTMLInputElement>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);

  const [sendMessage] = useAddNewMessageMutation();
  const { data: conversations } = useGetConversationsQuery({});
  const { data, refetch } = useGetMessagesQuery(id);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages(data?.message?.messages);
  }, [data]);

  const handleSendMessage = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const reciever = conversations?.conversation.filter((u: any) => {
      return u._id === id;
    });

    const receiverInfo = reciever[0].users.filter((u: any) => {
      return u._id !== user.user?.userId;
    });

    socket.emit("private_message", {
      sender: { username: user?.user?.username, userId: user?.user?.userId },
      reciever: {
        username: receiverInfo[0].username,
        userId: receiverInfo[0]._id,
      },
      message: input,
    });

    const msg = {
      status: "DELIVERED",
      content: input,
      sender: user.user?.userId,
    };

    const newmsg = {
      status: "DELIVERED",
      content: input,
      sender: { _id: user.user?.userId, username: user.user?.username },
    };

    await sendMessage({ msg, conversationId: id });
    setMessages((prev) => [...prev, newmsg]);
  };

  const handleEmoji = (emoji: EmojiClickData) => {
    setInput(input + emoji.emoji);
  };

  useEffect(() => {
    socket.on("private_message", ({ sender, reciever, message }) => {
      if (reciever.username == user?.user?.username) {
        setArrivalMessage({ status: "DELIVERED", content: message, sender });
        console.log("RECIEVED " + sender.username);
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, arrivalMessage]);
  }, [arrivalMessage]);

  useEffect(() => {
    refetch();
    socketConnect(user);
    recieverRef.current?.focus;
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ flex: "1", display: "flex", gap: "1em", overflow: "hidden" }}>
      <PageContainer style={{ display: "flex", flexDirection: "column" }}>
        <PageTitle>
          <h1>{name}</h1>
        </PageTitle>

        <div style={{ flex: "1", overflow: "hidden", position: "relative" }}>
          <div
            style={{
              height: "90%",
              overflowY: "scroll",
              padding: "1em",
              width: "100%",
            }}
          >
            <div style={{ width: "100%", height: "100%" }}>
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                {messages &&
                  messages?.map((m) => (
                    <ChatBubble
                      fromSelf={m.sender._id == user.user?.userId}
                      ref={scrollRef}
                    >
                      <p>{m.content}</p>
                    </ChatBubble>
                  ))}
              </div>

              <MessageInputContainer>
                <Form onSubmit={handleSendMessage}>
                  <Input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Text Message"
                  />
                  <span onClick={() => setOpenEmoji(!openEmoji)}>
                    <BsEmojiSmile />
                  </span>
                  <Button label="Send" isLoading={false} color={false} />
                </Form>
              </MessageInputContainer>
              {openEmoji && (
                <EmojiContainer>
                  <EmojiPicker
                    onEmojiClick={(emoji: EmojiClickData) => handleEmoji(emoji)}
                  />
                </EmojiContainer>
              )}
            </div>
          </div>
        </div>
      </PageContainer>

      <SideContent>
        <div style={{ height: "40px", marginBottom: "1em" }}>
          <h3>Trending</h3>
        </div>

        <SideFriendContainer>
          <h3>Friends</h3>

          <SideFriendInner>
            <p>Followers</p>
            {/* {currentUserData
              ? currentUserData.user.followers.map((follower: any) => (
                  <div
                    style={{
                      padding: "1em",
                      backgroundColor: "var(--dark--color-900)",
                      marginTop: ".5em",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onClick={() =>
                      setReciepient({
                        userId: follower._id,
                        username: follower.username,
                      })
                    }
                  >
                    <p>{follower.username}</p>
                    <p>new</p>
                  </div>
                ))
              : null} */}
          </SideFriendInner>

          <SideFriendInner>
            <p>Followings</p>
            {/* {currentUserData
              ? currentUserData.user.followings.map((follower: any) => (
                  <div
                    style={{
                      padding: "1em",
                      backgroundColor: "var(--dark--color-900)",
                      marginTop: ".5em",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                    onClick={() =>
                      setReciepient({
                        userId: follower._id,
                        username: follower.username,
                      })
                    }
                  >
                    <p>{follower.username}</p>
                    <p>new</p>
                  </div>
                ))
              : null} */}
          </SideFriendInner>
        </SideFriendContainer>
      </SideContent>
    </div>
  );
};

export default index;

export const InputContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    font-size: 1rem;
  }

  span {
    display: flex;
    align-items: center;
    font-size: 1.2rem;
  }
`;

const Input = styled.input`
  border: none;
  outline: none;
  background-color: transparent;
  flex: 1;
  color: white;
  padding: 0 0.5em;
  font-size: 1rem;
`;

const MessageInputContainer = styled.div`
  position: absolute;
  bottom: 1em;
  left: 0;
  right: 0;
  width: 100%;
  height: 35px;
  padding: 0 1em;
  display: flex;
  align-items: center;
  border-radius: 10px;
  background-color: var(--dark--color-800);
`;

const Form = styled.form`
  /* width: 100%; */
  display: flex;
  align-items: center;
  flex: 1;

  span {
    display: flex;
    align-items: center;
    margin-inline: 0.5em;
    font-size: 1.3rem;
  }

  input {
    font-size: 1.1rem;
  }
`;

const EmojiContainer = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

const SideFriendContainer = styled.div``;

const SideFriendInner = styled.div`
  margin-top: 1em;

  div {
    border-radius: 10px;
  }

  p {
    font-weight: 600;
  }
`;

interface IProps {
  fromSelf: boolean;
}

const ChatBubble = styled.div<IProps>`
  max-width: 40%;
  /* width: fit-content; */
  word-wrap: break-word;
  padding: 0.5em 1em;
  margin-top: 0.5em;
  align-self: ${(props) => (props.fromSelf ? "flex-start" : "flex-end")};
  background: ${(props) =>
    props.fromSelf ? "var(--primary--color-300)" : "var(--primary--color-400)"};
  color: white;
  border-bottom-left-radius: ${(props) => (props.fromSelf ? "" : "")};
  border-top-left-radius: ${(props) => (props.fromSelf ? "1.5em" : "1.5em")};
  border-bottom-right-radius: ${(props) => (props.fromSelf ? "1.5em" : "")};
  border-top-right-radius: ${(props) => (props.fromSelf ? "1.5em" : "")};

  border-bottom-right-radius: ${(props) => (props.fromSelf ? "" : "")};
  border-bottom-left-radius: ${(props) => (props.fromSelf ? "" : "1.5em")};
  border-top-right-radius: ${(props) => (props.fromSelf ? "" : "1.5em")};
`;
