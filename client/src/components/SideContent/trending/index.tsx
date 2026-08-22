import { Link } from "react-router-dom";
import styled from "styled-components";
import { Container } from "../../../lib/styled-component/styles";
import { useGetTrendingPostsQuery } from "../../../features/api/post";
import Loader from "../../UI/Loader";
import { IPost } from "../../../utils/types/types";
import { getElaspeTime } from "../../../utils/functions/elaspeTime";

const Index = () => {
  const { data, isLoading, isError } = useGetTrendingPostsQuery(undefined);

  if (isLoading) {
    return (
      <Container>
        <LoaderWrap>
          <Loader />
        </LoaderWrap>
      </Container>
    );
  }

  if (isError) {
    return (
      <Container>
        <Empty>Could not load trending posts.</Empty>
      </Container>
    );
  }

  const posts: IPost[] = data?.post ?? [];

  if (posts.length === 0) {
    return (
      <Container>
        <Empty>No posts yet. Be the first to post!</Empty>
      </Container>
    );
  }

  return (
    <Container>
      <List>
        {posts.map((post, index) => (
          <Item key={post._id}>
            <Rank>#{index + 1}</Rank>
            <Body>
              <Author to={`/${post.author?.username}`}>
                @{post.author?.username}
              </Author>
              <Snippet>
                {post.content
                  ? post.content.slice(0, 80) +
                    (post.content.length > 80 ? "…" : "")
                  : "[Image post]"}
              </Snippet>
              <Meta>
                <span>{post.likes?.length ?? 0} likes</span>
                <span>·</span>
                <span>{getElaspeTime(new Date(post.createdAt))} ago</span>
              </Meta>
            </Body>
          </Item>
        ))}
      </List>
    </Container>
  );
};

export default Index;

const LoaderWrap = styled.div`
  width: 60px;
  height: 60px;
  margin: 2em auto;
`;

const Empty = styled.p`
  text-align: center;
  padding: 1.5em 0.5em;
  color: var(--txt--muted);
  font-size: 0.95rem;
`;

const List = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65em;
`;

const Item = styled.li`
  display: flex;
  gap: 0.75em;
  padding: 0.75em;
  border-radius: var(--radius-md);
  background: var(--dark--color-900);
  border: 1px solid var(--border-subtle);
`;

const Rank = styled.span`
  font-weight: 700;
  color: var(--primary--color-400);
  min-width: 2em;
  font-size: 0.9rem;
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
`;

const Author = styled(Link)`
  color: var(--primary--color-400);
  font-weight: 600;
  font-size: 0.9rem;

  &:hover {
    text-decoration: underline;
  }
`;

const Snippet = styled.p`
  margin: 0.25em 0;
  font-size: 0.85rem;
  line-height: 1.35;
  word-break: break-word;
  color: var(--txt--color-200);
`;

const Meta = styled.div`
  display: flex;
  gap: 0.35em;
  font-size: 0.75rem;
  color: var(--txt--muted);
`;
