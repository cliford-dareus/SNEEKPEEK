import { useParams } from "react-router-dom";
import Card from "../../../../components/UI/Card";
import Loader from "../../../../components/UI/Loader";
import { useGetTaggedPostsQuery } from "../../../../features/api/post";
import { IPost } from "../../../../utils/types/types";
import { LoaderContainer } from "../../index";
import styled from "styled-components";

const Index = () => {
  const { name } = useParams();
  const { data, isLoading, isError } = useGetTaggedPostsQuery(name || "", {
    skip: !name,
  });

  if (isLoading) {
    return (
      <LoaderContainer>
        <Loader />
      </LoaderContainer>
    );
  }

  if (isError) {
    return <Empty>Could not load tagged posts.</Empty>;
  }

  const posts: IPost[] = data?.post ?? [];

  if (posts.length === 0) {
    return <Empty>No tagged posts yet.</Empty>;
  }

  return (
    <div>
      {posts.map((post) => (
        <Card key={post._id} post={post} />
      ))}
    </div>
  );
};

export default Index;

const Empty = styled.p`
  text-align: center;
  padding: 2em 1em;
  opacity: 0.7;
`;
