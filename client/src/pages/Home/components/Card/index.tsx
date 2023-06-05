import styled from "styled-components";
import { IPost } from "../../../../utils/types/types";

const index = ({ post }: { post: IPost }) => {
  return (
    <CardContainer>
      <CardImage>
        <img src="" alt="" />
      </CardImage>

      <CardContent>
        <div>
          <p>{post.author.username}</p>
          <p>{new Date(post.createdAt).toDateString()}</p>
        </div>

        <div>
          <p>{post.content}</p>
        </div>

        <CardContentImage>
          <img src={post.image} alt="" />
        </CardContentImage>
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

const CardImage = styled.div`
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

const CardContentImage = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1em;
`;
