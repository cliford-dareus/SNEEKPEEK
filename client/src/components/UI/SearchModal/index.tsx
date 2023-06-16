import styled from "styled-components";
import { useSearchUserQuery } from "../../../features/api/user";
import { IRequestData } from "../../../utils/types/types";
import { useCreateConversationMutation } from "../../../features/api/conversations";
import { useNavigate } from "react-router-dom";

interface IProp {
  data: { searchTerm: string };
}

const index = ({ data }: IProp) => {
  const Navigate = useNavigate()
  const [createConversation] = useCreateConversationMutation();
  const { data: users, isLoading } = useSearchUserQuery({
    searchTerm: data.searchTerm,
  });

  const handleConversation = async ({id, name}: {id: string, name: string}) => {
    try {
      const channel = await createConversation(id).unwrap();
      Navigate(`chat/${name}/${channel?.conversation._id}`)
    } catch (error) {
      console.log(error)
    }
  };

  return (
    <ReciepientPickerModal>
      {!isLoading &&
        users?.users.map((user: IRequestData) => (
          <p onClick={() => handleConversation({id: user._id, name: user.username})}>{user.username}</p>
        ))}
    </ReciepientPickerModal>
  );
};

export default index;

const ReciepientPickerModal = styled.div`
  position: absolute;
  top: 3.5em;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  height: 5em;
  padding: 1em;
  background-color: var(--dark--color-800);
  border-radius: 10px;

  p {
    padding: 0.5em;
  }
`;
