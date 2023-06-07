import { useGetPostQuery } from "../../features/api/post";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import Loader from "../../components/Loader";
import { IPost } from "../../utils/types/types";
import Card from "../../components/Card";
import Featured from "./components/CreatePost";
import { useAuth } from "../../lib/hooks/useAuth";

const index = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useGetPostQuery("");

  const sortedData = () => {
    const dataCopy = data?.post.slice();
    return dataCopy?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  return (
    <PageContainer>
      <PageTitle>
        <h1>Explore</h1>
      </PageTitle>

      <div>{auth.token && <Featured />}</div>

      {isError? <h2>Error Baby</h2>: null}

      <div>
        {!isLoading ? (
          <div>
            {sortedData()?.map((post: IPost) => (
              <Card post={post} />
            ))}
          </div>
        ) : (
          <div
            style={{
              width: "100%",
              height: "90%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              position: "absolute",
            }}
          >
            <div style={{ width: "150px", height: "150px" }}>
              <Loader />
            </div>
          </div>
        )}
      </div>
    </PageContainer>
  );
};

export default index;
