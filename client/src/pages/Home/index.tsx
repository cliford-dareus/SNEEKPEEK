import { useGetPostQuery } from "../../features/api/post";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import Loader from "../../components/Loader";
import { IPost } from "../../utils/types/types";
import Card from "./components/Card";
import Featured from "./components/CreatePost";
import { useAuth } from "../../lib/hooks/useAuth";

const index = () => {
  const auth = useAuth();
  const { data, isLoading } = useGetPostQuery("");

  return (
    <PageContainer>
      <PageTitle>
        <h1>Explore</h1>
      </PageTitle>

      <div>{auth.token && <Featured />}</div>

      <div>
        {!isLoading ? (
          <div>
            {data?.post.map((post: IPost) => (
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
