import styled from "styled-components";
import { BsImage, BsPeople } from "react-icons/bs";
import Button from "../../../../components/UI/Button";
import CreatePostModal from "./CreatePostModal";
import Label from "./Label";
import React, { FormEvent, useState } from "react";
import { usePostMutation } from "../../../../features/api/post";
import toast from "react-hot-toast";

interface IPostForm {
  content: string;
  image: string;
  tagsInput: string;
}

const Index = () => {
  const [createPost, { isLoading }] = usePostMutation();
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [post, setPost] = useState<IPostForm>({
    content: "",
    image: "",
    tagsInput: "",
  });

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPost({ ...post, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!post.content.trim() && !post.image.trim()) {
      toast.error("Write something or add an image");
      return;
    }

    const tags = post.tagsInput
      .split(/[,\s]+/)
      .map((t) => t.replace(/^@/, "").trim())
      .filter(Boolean);

    try {
      await createPost({
        content: post.content.trim(),
        image: post.image.trim(),
        tags,
      }).unwrap();
      setPost({ content: "", image: "", tagsInput: "" });
      setOpenModal(false);
      toast.success("Posted");
    } catch {
      toast.error("Could not create post");
    }
  };

  return (
    <CreatePostContainer>
      <CreatePostImage />
      <CreatePostContent>
        <form onSubmit={handleSubmit}>
          <CreatePostInput
            type="text"
            placeholder="What's on your mind?"
            name="content"
            value={post.content}
            onChange={handleInput}
          />

          <TagsInput
            type="text"
            name="tagsInput"
            value={post.tagsInput}
            onChange={handleInput}
            placeholder="Tag users (usernames, comma-separated)"
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

            <TagHint>
              <BsPeople /> Tags optional
            </TagHint>

            <Button isLoading={isLoading} label="Post" color={true} />
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

export default Index;

const CreatePostContainer = styled.div`
  background-color: var(--dark--color-800);
  margin-top: 1em;
  border-radius: 10px;
  padding: 1em;
  display: flex;
  gap: 1em;
  position: relative;
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

const TagsInput = styled(CreatePostInput)`
  margin-top: 0.5em;
  font-size: 0.95rem;
`;

const CreatePostContentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75em;
  margin-top: 1em;
  flex-wrap: wrap;
`;

const TagHint = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35em;
  font-size: 0.8rem;
  opacity: 0.7;
`;
