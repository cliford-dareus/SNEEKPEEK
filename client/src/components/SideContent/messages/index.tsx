import { useEffect, useState } from "react";
import { Container } from "../../../lib/styled-component/styles";
import { socket } from "../../../lib/socket/config";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/slice/authSlice";

const index = () => {
  const user = useAppSelector(selectCurrentUser).user?.username;
  const [message, setMessage] = useState<string[]>([]);

  

  useEffect(() => {
    socket.on("private_message", ({ sender, reciever, message }) => {
      if (sender.username !== user && reciever.username === user) {
        setMessage((prev) => [...prev, sender.username]);
      }
    });
  }, []);

  return (
    <Container>
      <p>
        {message.map((msg) => (
          <p>{msg}</p>
        ))}
      </p>
    </Container>
  );
};

export default index;
