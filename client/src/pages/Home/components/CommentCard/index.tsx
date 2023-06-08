import styled from "styled-components";
import { useGetPostWithCommentQuery } from "../../../../features/api/comment";
import Loader from '../../../../components/UI/Loader'
import { Link } from "react-router-dom";

const index = ({ postId }: { postId: string }) => {
  const { data, isLoading } = useGetPostWithCommentQuery(postId);

  return (
    <div>
      {!isLoading ? (
        data?.comment.map((comment: any) => (
          <CommentCardContainer>
            <CommentCardImage to={`${comment.user.username}`}>
              <img src="" alt="" />
            </CommentCardImage>

            <CommentCardContent>
              <CommentCardAuthor>
                <CommentCardAuthorName to={`${comment.user.username}`}>@{comment.user.username}</CommentCardAuthorName>
                <p>
                  {new Date(comment.comment.createdAt).toLocaleTimeString()}
                </p>
              </CommentCardAuthor>

              <CommentCardText>
                <p>{comment.comment.content}</p>
              </CommentCardText>
            </CommentCardContent>
          </CommentCardContainer>
        ))
      ) : (
        <div style={{ width: '50px', height: '50px'}}>
          <Loader />
        </div>
      )}
    </div>
  );
};

export default index;

const CommentCardContainer = styled.div`
  padding: .5em 1em;
  background-color: var(--dark--color-900);
  border-radius: 10px;
  display: flex;
  align-items: flex-start;
  gap: 1em;
  margin-top: 1em;
`;

const CommentCardImage = styled(Link)`
  width: 30px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: azure;
`;

const CommentCardContent = styled.div`
  flex: 1;
`;

const CommentCardAuthor = styled.div`
  display: flex;
  justify-content: space-between;
`;

const CommentCardAuthorName = styled(Link)`
  color: var(--primary--color-400);
`;

const CommentCardText = styled.div`
  p{
    font-size: .85rem;
  }
`;
