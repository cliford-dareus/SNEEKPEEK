import styled from "styled-components";
import { IPost } from "../../utils/types/types";
import { BsChatDots, BsFillHeartFill, BsHeart, BsTag } from "react-icons/bs";
import CommentCard from "../../pages/Home/components/CommentCard";
import { FormEvent, useState } from "react";
import { useAuth } from "../../lib/hooks/useAuth";
import Button from "../Button";
import { usePostCommentMutation } from "../../features/api/comment";
import { useLikeOrUnlikePostMutation } from "../../features/api/post";
import { getElaspeTime } from "../../utils/functions/elaspeTime";
import { Link } from "react-router-dom";

const index = ({ post }: { post: IPost }) => {
  const auth = useAuth();
  const [comment, setComment] = useState("");
  const [postComment] = usePostCommentMutation();
  const [likePost] = useLikeOrUnlikePostMutation();
  const [openComment, setOpenComment] = useState(false);
  // const { refresh } = useGetPostQuery();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (!comment) {
        return;
      }
      await postComment({ postId: post._id, content: comment });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <CardContainer>
      <CardImage to={`${post.author.username}`}>
        <img src="" alt="" />
      </CardImage>

      <CardContent>
        <Link to={`${post.author.username}`} style={{ color: "inherit" }}>
          <p>{post.author.username}</p>
          <CardDate>{getElaspeTime(post.createdAt)} ago</CardDate>
        </Link>

        <div>
          <p>{post.content}</p>
        </div>

        <CardContentImage>
          <img src={post.image} alt="" />
        </CardContentImage>

        <CardActions>
          <CardActionsTop>
            <CardActionsTopLeft>
              <span>{post.likes.length} likes</span>
              <span onClick={() => setOpenComment(!openComment)}>
                {post.comments.length} comments
              </span>
            </CardActionsTopLeft>

            <div>
              <span>20 Tags</span>
            </div>
          </CardActionsTop>

          <CardActionsBottomIcons>
            <CardActionsBottomIconsLeft>
              <div onClick={async () => await likePost(post._id)}>
                {!post?.likes.find((d) => d._id === auth.user?.userId) ? (
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

            <span>
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
                    action=""
                    style={{ display: "flex", flex: "1", gap: "1em" }}
                  >
                    <input
                      type="text"
                      placeholder="Write your comment..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button label="Comment" isLoading={false} color={true} />
                  </form>
                </CardActionsBottomInput>
              </>
            )}
          </div>
        </CardActions>
      </CardContent>
    </CardContainer>
  );
};

export default index;

const CardContainer = styled.div`
  background-color: var(--dark--color-800);
  margin: 1em 0;
  display: flex;
  gap: 1em;
  padding: 1em;
`;

const CardImage = styled(Link)`
  /* width: 20%; */

  img {
    width: 45px;
    aspect-ratio: 1;
    background-color: aliceblue;
    border-radius: 50%;
  }
`;

const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const CardDate = styled.span`
  color: var(--light--color-400);
  display: block;
  font-size: 0.85rem;
  line-height: 0.9;
  margin-bottom: 1em;
`;

const CardContentImage = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1em;
`;

const CardActions = styled.div`
  margin-top: 1em;
`;

const CardActionsTop = styled.div`
  font-size: 0.85rem;
  color: var(--light--color-400);
  display: flex;
`;

const CardActionsTopLeft = styled.div`
  display: flex;
  margin-right: auto;

  span {
    margin-right: 1em;
  }
`;

const CardActionsBottomIcons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5em;
`;

const CardActionsBottomIconsLeft = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1em;
    font-size: 1.3rem;
  }
`;

const CardActionsBottomInput = styled.div`
  display: flex;
  margin: 1em 0;

  img {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: aliceblue;
  }

  input {
    flex: 1;
    margin-left: 1em;
    margin-right: auto;
    border: none;
    outline: none;
    background-color: var(--dark--color-900);
    border-radius: 10px;
    color: white;
    font-size: 0.9rem;
  }
`;
