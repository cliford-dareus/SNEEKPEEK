import { useGetPostQuery } from "../../features/api/post";
import { IPost } from "../../utils/types/types";
import Featured from "./components/CreatePost";
import Loader from "../../components/UI/Loader";
import Card from "../../components/UI/Card";
import { useAuth } from "../../lib/hooks/useAuth";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import styled from "styled-components";

const Index = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useGetPostQuery("");

  const sortedData = () => {
    const dataCopy = data?.post?.slice();
    return dataCopy?.sort(
      (a: IPost, b: IPost) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  const posts = sortedData();

  return (
    <PageContainer>
      <PageTitle>
        <h1>Explore</h1>
      </PageTitle>

      <div>{auth.token && <Featured />}</div>

      {isError ? <Empty>Could not load posts. Try again later.</Empty> : null}

      <div>
        {!isLoading ? (
          posts && posts.length > 0 ? (
            <div>
              {posts.map((post: IPost) => (
                <Card key={post._id} post={post} />
              ))}
            </div>
          ) : (
            !isError && <Empty>No posts yet. Share something!</Empty>
          )
        ) : (
          <LoaderWrap>
            <div style={{ width: "150px", height: "150px" }}>
              <Loader />
            </div>
          </LoaderWrap>
        )}
      </div>
    </PageContainer>
  );
};

export default Index;

const LoaderWrap = styled.div`
  width: 100%;
  height: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
`;

const Empty = styled.p`
  text-align: center;
  padding: 2em 1em;
  color: var(--txt--muted);
`;
