import { useEffect, useState } from "react";
import { Container } from "../../../lib/styled-component/styles";
import { socket } from "../../../lib/socket/config";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/slice/authSlice";
import { useGetConversationsQuery } from "../../../features/api/conversations";

const index = () => {
  const user = useAppSelector(selectCurrentUser);
  const [message, setMessage] = useState<string[]>([]);
  // const { data: conversations, isLoading } = useGetConversationsQuery({});

  // console.log(conversations)

  useEffect(() => {
    socket.on("private_message", ({ sender, reciever, message }) => {
      if (sender.username !== user && reciever.username === user.user?.username) {
        setMessage((prev) => [...prev, sender.username]);
        console.log("RECIEVED " + sender.username);
      }
    });
  }, []);

  return (
    <Container>
      <div>
        {message.map((msg) => (
          <p>{msg}</p>
        ))}
      </div>
    </Container>
  );
};

export default index;
