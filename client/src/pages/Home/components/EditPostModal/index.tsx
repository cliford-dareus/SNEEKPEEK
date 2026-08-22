import { FormEvent, useState } from "react";
import styled from "styled-components";
import { BsXLg } from "react-icons/bs";
import { IPost } from "../../../../utils/types/types";
import Button from "../../../../components/UI/Button";
import { useUpdatePostMutation } from "../../../../features/api/post";
import toast from "react-hot-toast";

interface Props {
  post: IPost;
  onClose: () => void;
}

const EditPostModal = ({ post, onClose }: Props) => {
  const [content, setContent] = useState(post.content || "");
  const [image, setImage] = useState(post.image || "");
  const [updatePost, { isLoading }] = useUpdatePostMutation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!content.trim() && !image.trim()) {
      toast.error("Post cannot be empty");
      return;
    }

    try {
      await updatePost({
        postId: post._id,
        content: content.trim(),
        image: image.trim(),
      }).unwrap();
      toast.success("Post updated");
      onClose();
    } catch {
      toast.error("Failed to update post");
    }
  };

  return (
    <Overlay onClick={onClose}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Header>
          <h3>Edit post</h3>
          <CloseBtn type="button" onClick={onClose} aria-label="Close">
            <BsXLg />
          </CloseBtn>
        </Header>

        <form onSubmit={handleSubmit}>
          <TextArea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            rows={4}
            maxLength={500}
          />
          <Input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            placeholder="Image URL (optional)"
          />
          {image ? (
            <Preview>
              <img src={image} alt="Preview" />
            </Preview>
          ) : null}
          <Actions>
            <Button label="Save" isLoading={isLoading} color={true} />
          </Actions>
        </form>
      </Modal>
    </Overlay>
  );
};

export default EditPostModal;

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100000;
  padding: 1em;
`;

const Modal = styled.div`
  width: 100%;
  max-width: 420px;
  background: var(--dark--color-800);
  border-radius: 12px;
  padding: 1.25em;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1em;

  h3 {
    margin: 0;
    font-size: 1.1rem;
  }
`;

const CloseBtn = styled.button`
  border: none;
  background: transparent;
  color: var(--primary--color-400);
  font-size: 1.25rem;
  cursor: pointer;
`;

const TextArea = styled.textarea`
  width: 100%;
  border: none;
  outline: none;
  border-radius: 10px;
  padding: 0.75em 1em;
  background: var(--dark--color-900);
  color: white;
  font-size: 1rem;
  resize: vertical;
  margin-bottom: 0.75em;
`;

const Input = styled.input`
  width: 100%;
  border: none;
  outline: none;
  border-radius: 10px;
  padding: 0.75em 1em;
  background: var(--dark--color-900);
  color: white;
  font-size: 1rem;
  margin-bottom: 0.75em;
`;

const Preview = styled.div`
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 10px;
  margin-bottom: 0.75em;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

const Actions = styled.div`
  display: flex;
  justify-content: flex-end;
`;
