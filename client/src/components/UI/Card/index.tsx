import { IPost } from "../../../utils/types/types";
import {
  BsChatDots,
  BsFillHeartFill,
  BsHeart,
  BsPencil,
  BsTag,
  BsThreeDots,
  BsTrash,
} from "react-icons/bs";
import CommentCard from "../../../pages/Home/components/CommentCard";
import { FormEvent, useEffect, useRef, useState } from "react";
import { useAuth } from "../../../lib/hooks/useAuth";
import Button from "../Button";
import { usePostCommentMutation } from "../../../features/api/comment";
import {
  useDeletePostMutation,
  useLikeOrUnlikePostMutation,
} from "../../../features/api/post";
import { getElaspeTime } from "../../../utils/functions/elaspeTime";
import { Link } from "react-router-dom";
import EditPostModal from "../../../pages/Home/components/EditPostModal";
import toast from "react-hot-toast";
import {
  CardActions,
  CardActionsBottomIcons,
  CardActionsBottomIconsLeft,
  CardActionsBottomInput,
  CardActionsTop,
  CardActionsTopLeft,
  CardContainer,
  CardContent,
  CardContentImage,
  CardContentTop,
  CardDate,
  CardImage,
  CardName,
} from "./style";
import styled from "styled-components";

const Index = ({ post }: { post: IPost }) => {
  const auth = useAuth();
  const [comment, setComment] = useState("");
  const [postComment, { isLoading: isCommenting }] = usePostCommentMutation();
  const [likePost] = useLikeOrUnlikePostMutation();
  const [deletePost, { isLoading: isDeleting }] = useDeletePostMutation();
  const [openComment, setOpenComment] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isOwner =
    auth.user?.userId === post.author?._id ||
    auth.user?.username === post.author?.username;

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!comment.trim()) return;

    try {
      await postComment({ postId: post._id, content: comment.trim() }).unwrap();
      setComment("");
      toast.success("Comment added");
    } catch {
      toast.error("Could not post comment");
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this post?")) return;
    try {
      await deletePost(post._id).unwrap();
      toast.success("Post deleted");
      setMenuOpen(false);
    } catch {
      toast.error("Could not delete post");
    }
  };

  const tagCount = post.tags?.length ?? 0;

  return (
    <>
      <CardContainer>
        <CardImage to={`/${post.author?.username}`}>
          <img src={post.author?.image || ""} alt="" />
        </CardImage>

        <CardContent>
          <CardContentTop>
            <Link
              to={`/${post.author?.username}`}
              style={{ color: "inherit" }}
            >
              <CardName>{post.author?.username}</CardName>
              <CardDate>
                {getElaspeTime(new Date(post.createdAt))} ago
              </CardDate>
            </Link>

            {isOwner && (
              <MenuWrap ref={menuRef}>
                <MenuTrigger
                  type="button"
                  onClick={() => setMenuOpen((o) => !o)}
                  aria-label="Post options"
                >
                  <BsThreeDots />
                </MenuTrigger>
                {menuOpen && (
                  <Menu>
                    <MenuItem
                      type="button"
                      onClick={() => {
                        setEditOpen(true);
                        setMenuOpen(false);
                      }}
                    >
                      <BsPencil /> Edit
                    </MenuItem>
                    <MenuItem
                      type="button"
                      $danger
                      disabled={isDeleting}
                      onClick={handleDelete}
                    >
                      <BsTrash /> Delete
                    </MenuItem>
                  </Menu>
                )}
              </MenuWrap>
            )}
          </CardContentTop>

          <div>
            <p>{post.content}</p>
          </div>

          {post.image ? (
            <CardContentImage>
              <img src={post.image} alt="" />
            </CardContentImage>
          ) : null}

          {tagCount > 0 && (
            <TagsRow>
              {post.tags!.map((t) => (
                <TagLink key={t._id} to={`/${t.username}`}>
                  @{t.username}
                </TagLink>
              ))}
            </TagsRow>
          )}

          <CardActions>
            <CardActionsTop>
              <CardActionsTopLeft>
                <span>{post.likes?.length ?? 0} likes</span>
                <span onClick={() => setOpenComment(!openComment)}>
                  {post.comments?.length ?? 0} comments
                </span>
              </CardActionsTopLeft>

              <div>
                <span>{tagCount} Tags</span>
              </div>
            </CardActionsTop>

            <CardActionsBottomIcons>
              <CardActionsBottomIconsLeft>
                <div
                  onClick={async () => {
                    if (!auth.token) return;
                    await likePost(post._id);
                  }}
                >
                  {!post?.likes?.find(
                    (d) =>
                      d._id === auth.user?.userId ||
                      d.username === auth.user?.username
                  ) ? (
                    <span>
                      <BsHeart />
                    </span>
                  ) : (
                    <span style={{ color: "red" }}>
                      <BsFillHeartFill />
                    </span>
                  )}
                </div>

                <span onClick={() => setOpenComment(!openComment)}>
                  <BsChatDots />
                </span>
              </CardActionsBottomIconsLeft>

              <span title="Tags">
                <BsTag />
              </span>
            </CardActionsBottomIcons>

            <div>
              {openComment && auth.token && (
                <>
                  <CommentCard postId={post._id} />

                  <CardActionsBottomInput>
                    <div>
                      <img src="" alt="" />
                    </div>
                    <form
                      onSubmit={handleSubmit}
                      style={{ display: "flex", flex: "1", gap: "1em" }}
                    >
                      <input
                        type="text"
                        placeholder="Write your comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                      />
                      <Button
                        label="Comment"
                        isLoading={isCommenting}
                        color={true}
                      />
                    </form>
                  </CardActionsBottomInput>
                </>
              )}
            </div>
          </CardActions>
        </CardContent>
      </CardContainer>

      {editOpen && (
        <EditPostModal post={post} onClose={() => setEditOpen(false)} />
      )}
    </>
  );
};

export default Index;

const MenuWrap = styled.div`
  position: relative;
`;

const MenuTrigger = styled.button`
  border: none;
  background: transparent;
  color: inherit;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 0.25em;
`;

const Menu = styled.div`
  position: absolute;
  right: 0;
  top: 100%;
  min-width: 120px;
  background: var(--dark--color-900);
  border-radius: 8px;
  padding: 0.35em;
  z-index: 20;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.35);
`;

const MenuItem = styled.button<{ $danger?: boolean }>`
  width: 100%;
  display: flex;
  align-items: center;
  gap: 0.5em;
  border: none;
  background: transparent;
  color: ${(p) => (p.$danger ? "#f87171" : "inherit")};
  padding: 0.5em 0.75em;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: var(--dark--color-800);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const TagsRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-top: 0.5em;
`;

const TagLink = styled(Link)`
  font-size: 0.85rem;
  color: var(--primary--color-400);
`;
