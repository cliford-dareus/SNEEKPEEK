import styled from "styled-components";
import { BsImage } from "react-icons/bs";
import Button from "../../../../components/Button";
import CreatePostModal from "./CreatePostModal";
import Label from "./Label";
import React, { FormEvent, useState } from "react";
import { usePostMutation } from "../../../../features/api/post";

interface IPost {
  content: string;
  image: string;
}

const index = () => {
  const [createPost] = usePostMutation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [post, setPost] = useState<IPost>({
    content: "",
    image: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = await createPost(post).unwrap()
    console.log(data);

  };

  return (
    <CreatePostContainer>
      <CreatePostImage></CreatePostImage>
      <CreatePostContent>
        <form onSubmit={handleSubmit}>
          <CreatePostInput
            type="text"
            placeholder="What's on your mind?"
            name="content"
            value={post.content}
            onChange={handleInput}
          />

          <CreatePostContentActions>
            <div onClick={() => setOpenModal(!openModal)}>
              <Label
                icon={<BsImage />}
                label="Add Photo"
                type="none"
                value=""
                handleInput="none"
              />
            </div>

            <Button isLoading={false} label="Post" color={true} />
          </CreatePostContentActions>
        </form>
        {openModal && (
          <CreatePostModal
            setOpenModal={setOpenModal}
            value={post.image}
            handleInput={handleInput}
          />
        )}
      </CreatePostContent>
    </CreatePostContainer>
  );
};

export default index;

const CreatePostContainer = styled.div`
  background-color: var(--dark--color-800);
  margin-top: 1em;
  border-radius: 10px;
  padding: 1em;
  display: flex;
  gap: 1em;
`;

const CreatePostImage = styled.div`
  width: 40px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: aliceblue;
  align-self: flex-start;
`;

const CreatePostContent = styled.div`
  flex: 1;
`;

const CreatePostInput = styled.input`
  width: 100%;
  outline: none;
  border: none;
  padding: 0.5em 1em;
  border-radius: 10px;
  background-color: var(--dark--color-900);
  color: white;
  font-size: 1.1rem;
`;

const CreatePostContentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 1em;
`;
