import { FC } from "react";
import { IRequestData } from "../../../utils/types/types";
import styled from "styled-components";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";
import { useAcceptRequestMutation } from "../../../features/api/user";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/slice/authSlice";
import { socket } from "../../../lib/socket/config";

const Index: FC<{ req: IRequestData }> = ({ req }) => {
  const [accept] = useAcceptRequestMutation();
  const user = useAppSelector(selectCurrentUser);

  const handleAcccept = async (id: string) => {
    try {
      await accept(id);

      socket.emit("notification", {
        message: "accepted your follow request",
        target: { userId: req._id, username: req.username },
        sender: { userId: user?.user?.userId, username: user?.user?.username },
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleReject = async (id: string) => {
    try {
      console.log(id);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <RequestContainer>
      <RequestImage aria-hidden />
      <RequestContent>@{req.username}</RequestContent>

      <RequestActions>
        <ActionBtn
          type="button"
          $variant="accept"
          onClick={() => handleAcccept(req._id)}
          aria-label={`Accept ${req.username}`}
        >
          <RiUserFollowLine />
        </ActionBtn>
        <ActionBtn
          type="button"
          $variant="reject"
          onClick={() => handleReject(req._id)}
          aria-label={`Decline ${req.username}`}
        >
          <RiUserUnfollowLine />
        </ActionBtn>
      </RequestActions>
    </RequestContainer>
  );
};

export default Index;

const RequestContainer = styled.div`
  background-color: var(--dark--color-900);
  border: 1px solid var(--border-subtle);
  width: 100%;
  padding: 0.65em 0.9em;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  margin-bottom: 0.65em;
`;

const RequestImage = styled.div`
  width: 36px;
  aspect-ratio: 1;
  background-color: var(--dark--color-700);
  border-radius: 50%;
  margin-right: 0.85em;
  border: 1px solid var(--border-subtle);
`;

const RequestContent = styled.p`
  margin-right: auto;
  font-weight: 500;
  font-size: 0.95rem;
`;

const RequestActions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5em;
`;

const ActionBtn = styled.button<{ $variant: "accept" | "reject" }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: none;
  font-size: 1.05rem;
  cursor: pointer;
  color: white;
  background-color: ${(p) =>
    p.$variant === "accept" ? "var(--success)" : "var(--danger)"};
  transition: opacity 0.15s ease, transform 0.1s ease;

  &:hover {
    opacity: 0.9;
  }

  &:active {
    transform: scale(0.95);
  }
`;
