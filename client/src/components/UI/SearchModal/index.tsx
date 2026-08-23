import styled from "styled-components";
import { useSearchUserQuery } from "../../../features/api/user";
import { IRequestData } from "../../../utils/types/types";
import { useCreateConversationMutation } from "../../../features/api/conversations";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

interface IProp {
  data: { searchTerm: string };
}

const Index = ({ data }: IProp) => {
  const navigate = useNavigate();
  const [createConversation] = useCreateConversationMutation();
  const { data: users, isLoading } = useSearchUserQuery({
    searchTerm: data.searchTerm,
  });

  const handleConversation = async ({
    id,
    name,
  }: {
    id: string;
    name: string;
  }) => {
    try {
      const channel = await createConversation(id).unwrap();
      navigate(`/chat/${name}/${channel?.conversation._id}`);
    } catch {
      toast.error("Could not start conversation");
    }
  };

  return (
    <RecipientPickerModal>
      {!isLoading &&
        users?.users?.map((user: IRequestData) => (
          <p
            key={user._id}
            onClick={() =>
              handleConversation({ id: user._id, name: user.username })
            }
          >
            @{user.username}
          </p>
        ))}
    </RecipientPickerModal>
  );
};

export default Index;

const RecipientPickerModal = styled.div`
  position: absolute;
  top: 3.5em;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  max-height: 12em;
  overflow-y: auto;
  padding: 0.75em;
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  z-index: 50;

  p {
    padding: 0.55em 0.75em;
    border-radius: var(--radius-sm);
    cursor: pointer;

    &:hover {
      background: var(--dark--color-750);
      color: var(--primary--color-400);
    }
  }
`;
