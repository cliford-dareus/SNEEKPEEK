import styled from "styled-components";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAppSelector } from "../../app/hooks";
import { BsEmojiSmile, BsPlusCircle } from "react-icons/bs";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Button from "../../components/UI/Button";
import ReciepientModal from "../../components/UI/SearchPopup";
import SideContent from "../../components/SideContent";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { useGetUserByUsernameQuery } from "../../features/api/user";
import { socket } from "../../lib/socket/config";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";

interface IMessage {
  sender: { username: string; userId: string };
  reciever: { username: string; userId: string };
  message: string;
}

const index = () => {
  const user = useAppSelector(selectCurrentUser);
  const [input, setInput] = useState("");
  const [receipient, setReciepient] = useState({ userId: "", username: "" });
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [arrivalMessage, setArrivalMessage] = useState<IMessage>();
  const recieverRef = useRef<HTMLInputElement>(null);
  const [openEmoji, setOpenEmoji] = useState<boolean>(false);
  const [openReciepientList, setOpenReciepientList] = useState<boolean>(false);
  const { data: currentUserData } = useGetUserByUsernameQuery(
    user?.user?.username
  );

  const handleSendMessage = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket.emit("private_message", {
      sender: { username: user?.user?.username, userId: user?.user?.userId },
      reciever: { username: receipient.username, userId: receipient.userId },
      message: input,
    });
  };

  const handleEmoji = (emoji: EmojiClickData) => {
    setInput(input + emoji.emoji);
  };

  useEffect(() => {
    socket.on("private_message", ({ sender, reciever, message }) => {
      if (sender.username !== user?.user?.username) {
        setArrivalMessage({ sender, reciever, message });
      }
    });
  }, []);

  useEffect(() => {
    arrivalMessage && setMessages((prev) => [...prev, { ...arrivalMessage }]);
  }, [arrivalMessage]);

  useEffect(() => {
    recieverRef.current?.focus;
  }, []);

  return (
    <div style={{ flex: "1", display: "flex", gap: "1em" }}>
      <PageContainer style={{ display: "flex", flexDirection: "column" }}>
        <PageTitle>
          <InputContainer
            style={{ position: "relative", isolation: "isolate" }}
          >
            <p>To :</p>
            <Input
              type="text"
              ref={recieverRef}
              autoFocus
              name="username"
              value={receipient.username}
              onChange={(e) =>
                setReciepient({
                  ...receipient,
                  [e.target.name]: e.target.value,
                })
              }
            />
            <span onClick={() => setOpenReciepientList(!openReciepientList)}>
              <BsPlusCircle />
            </span>
          </InputContainer>

          {openReciepientList && (
            <ReciepientModal
              currentUserData={currentUserData}
              setReciepient={setReciepient}
              openReciepientList={openReciepientList}
              searchWord={receipient.username}
              setOpenReciepientList={setOpenReciepientList}
            />
          )}
        </PageTitle>

        <div style={{ flex: "1" }}>
          <div style={{ minHeight: "100%", position: "relative" }}>
            <div>
              {messages?.map((message) => (
                <>
                  <p>{message.message}</p>
                </>
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
      </PageContainer>

      <SideContent>
        <div style={{ height: "40px", marginBottom: "1em" }}>
          <h3>Trending</h3>
        </div>

        <SideFriendContainer>
          <h3>Friends</h3>

          <SideFriendInner>
            <p>Followers</p>
            {currentUserData
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
              : null}
          </SideFriendInner>

          <SideFriendInner>
            <p>Followings</p>
            {currentUserData
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
              : null}
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
