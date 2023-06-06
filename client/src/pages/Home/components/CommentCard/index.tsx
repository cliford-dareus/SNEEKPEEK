import styled from "styled-components";
import { useGetPostWithCommentQuery } from "../../../../features/api/comment";
import Loader from '../../../../components/Loader'

const index = ({ postId }: { postId: string }) => {
  const { data, isLoading } = useGetPostWithCommentQuery(postId);

  return (
    <div>
      {!isLoading ? (
        data?.comment.map((comment: any) => (
          <CommentCardContainer>
            <CommentCardImage>
              <img src="" alt="" />
            </CommentCardImage>

            <CommentCardContent>
              <CommentCardAuthor>
                <CommentCardAuthorName>@{comment.user.username}</CommentCardAuthorName>
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

const CommentCardImage = styled.div`
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

const CommentCardAuthorName = styled.p`
  color: var(--primary--color-400);
`;

const CommentCardText = styled.div`
  p{
    font-size: .85rem;
  }
`;
