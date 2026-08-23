import { useEffect, useState } from "react";
import { Container } from "../../../lib/styled-component/styles";
import { socket } from "../../../lib/socket/config";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/slice/authSlice";

const Index = () => {
  const user = useAppSelector(selectCurrentUser);
  const [senders, setSenders] = useState<string[]>([]);

  useEffect(() => {
    const handler = ({
      sender,
      reciever,
    }: {
      sender: { username: string };
      reciever: { username: string };
      message: string;
    }) => {
      if (
        sender.username !== user.user?.username &&
        reciever.username === user.user?.username
      ) {
        setSenders((prev) =>
          prev.includes(sender.username) ? prev : [...prev, sender.username]
        );
      }
    };

    socket.on("private_message", handler);
    return () => {
      socket.off("private_message", handler);
    };
  }, [user.user?.username]);

  return (
    <Container>
      {senders.length === 0 ? (
        <p style={{ opacity: 0.7, fontSize: "0.9rem" }}>No new messages</p>
      ) : (
        senders.map((name) => <p key={name}>@{name}</p>)
      )}
    </Container>
  );
};

export default Index;
