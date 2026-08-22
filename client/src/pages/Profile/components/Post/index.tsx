import { useParams } from "react-router-dom";
import Card from "../../../../components/UI/Card";
import { useGetUserPostQuery } from "../../../../features/api/post";
import Loader from "../../../../components/UI/Loader";
import { LoaderContainer } from "../../index";
import { IPost } from "../../../../utils/types/types";
import styled from "styled-components";

const Index = () => {
  const { name } = useParams();
  const { data: post, isLoading, isError } = useGetUserPostQuery(name || "", {
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
    return <Empty>Could not load posts.</Empty>;
  }

  const posts: IPost[] = post?.post ?? [];

  if (posts.length === 0) {
    return <Empty>No posts yet.</Empty>;
  }

  return (
    <div>
      {posts.map((p) => (
        <Card key={p._id} post={p} />
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
