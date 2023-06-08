import { FC } from "react";
import { IRequestData } from "../../../utils/types/types";
import styled from "styled-components";
import { RiUserFollowLine, RiUserUnfollowLine } from "react-icons/ri";

const index: FC<{ req: IRequestData }> = ({ req }) => {
  return (
    <div>
      <RequestContainer>
        <RequestImage></RequestImage>
        <RequestContent>{req.username}</RequestContent>

        <RequestActions>
          <span>
            <RiUserFollowLine />
          </span>
          <span>
            <RiUserUnfollowLine />
          </span>
        </RequestActions>
      </RequestContainer>
    </div>
  );
};

export default index;

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

    span{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        aspect-ratio: 1;
        border-radius: 50%;
        margin-left: 1em;
        font-size: 1.15rem;
    }

    span:nth-of-type(1){
        background-color: green;
    }

    span:nth-of-type(2){
        background-color: red;
    }

`;
