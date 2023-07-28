import { IPost } from "../../../utils/types/types";
import {
  BsChatDots,
  BsFillHeartFill,
  BsHeart,
  BsTag,
  BsThreeDots,
} from "react-icons/bs";
import CommentCard from "../../../pages/Home/components/CommentCard";
import { FormEvent, useState } from "react";
import { useAuth } from "../../../lib/hooks/useAuth";
import Button from "../Button";
import { usePostCommentMutation } from "../../../features/api/comment";
import { useLikeOrUnlikePostMutation } from "../../../features/api/post";
import { getElaspeTime } from "../../../utils/functions/elaspeTime";
import { Link } from "react-router-dom";
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

const Index = ({ post }: { post: IPost }) => {
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
        <CardContentTop>
          <Link to={`${post.author.username}`} style={{ color: "inherit" }}>
            <CardName>{post.author.username}</CardName>
            <CardDate>{getElaspeTime(post.createdAt)} ago</CardDate>
          </Link>

          <span>
            <BsThreeDots />
          </span>
        </CardContentTop>

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

export default Index;
