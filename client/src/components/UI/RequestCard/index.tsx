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
        message: "Request accepted",
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
    <div>
      <RequestContainer>
        <RequestImage></RequestImage>
        <RequestContent>{req.username}</RequestContent>

        <RequestActions>
          <span onClick={() => handleAcccept(req._id)}>
            <RiUserFollowLine />
          </span>
          <span onClick={() => handleReject(req._id)}>
            <RiUserUnfollowLine />
          </span>
        </RequestActions>
      </RequestContainer>
    </div>
  );
};

export default Index;

const RequestImage = styled.div`
  width: 35px;
  aspect-ratio: 1;
  background-color: whitesmoke;
  border-radius: 50%;
  margin-right: 1em;
`;

const RequestContainer = styled.div`
  background-color: var(--dark--color-900);
  width: 100%;
  padding: 0.5em 1em;
  border-radius: 10px;
  display: flex;
  align-items: center;
`;

const RequestContent = styled.p`
  margin-right: auto;
`;

const RequestActions = styled.div`
  display: flex;
  align-items: center;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-left: 1em;
    font-size: 1.15rem;
    cursor: pointer;
  }

  span:nth-of-type(1) {
    background-color: green;
  }

  span:nth-of-type(2) {
    background-color: red;
  }
`;
