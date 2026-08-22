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
      <CreatePostImage aria-hidden />
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
  border: 1px solid var(--border-subtle);
  margin-top: 0.25em;
  border-radius: var(--radius-md);
  padding: 1.1em;
  display: flex;
  gap: 0.9em;
  position: relative;
  box-shadow: var(--shadow-sm);
`;

const CreatePostImage = styled.div`
  width: 42px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: var(--dark--color-700);
  border: 1px solid var(--border-subtle);
  align-self: flex-start;
  flex-shrink: 0;
`;

const CreatePostContent = styled.div`
  flex: 1;
  min-width: 0;
`;

const CreatePostInput = styled.input`
  width: 100%;
  outline: none;
  border: 1px solid var(--border-strong);
  padding: 0.7em 1em;
  border-radius: var(--radius-md);
  background-color: var(--dark--color-900);
  color: var(--txt--color-100);
  font-size: 1rem;
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--light--color-600);
  }

  &:focus {
    border-color: var(--primary--color-400);
    box-shadow: 0 0 0 3px var(--focus-ring);
  }
`;

const TagsInput = styled(CreatePostInput)`
  margin-top: 0.55em;
  font-size: 0.9rem;
`;

const CreatePostContentActions = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75em;
  margin-top: 0.9em;
  flex-wrap: wrap;
`;

const TagHint = styled.span`
  display: flex;
  align-items: center;
  gap: 0.35em;
  font-size: 0.8rem;
  color: var(--txt--muted);
`;
