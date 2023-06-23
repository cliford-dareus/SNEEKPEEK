import { useGetPostQuery } from "../../features/api/post";
import { IPost } from "../../utils/types/types";
import Featured from "./components/CreatePost";
import Loader from "../../components/UI/Loader";
import Card from "../../components/UI/Card";
import { useAuth } from "../../lib/hooks/useAuth";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { useEffect } from "react";
import { socket } from "../../lib/socket/config";
import { toast } from "react-hot-toast";
// import { motion } from "framer-motion";

const Index = () => {
  const auth = useAuth();
  const { data, isLoading, isError } = useGetPostQuery("");

  const sortedData = () => {
    const dataCopy = data?.post.slice();
    return dataCopy?.sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  };

  useEffect(() => {
    socket.on("notification", ({ sender, target, type, message }) => {
      if (target.userId === auth.user?.userId) {
        toast(sender.username + " " + message);
      }
    });
  }, []);

  return (
    <PageContainer>
      <PageTitle>
        <h1>Explore</h1>
      </PageTitle>

      <div>{auth.token && <Featured />}</div>

      {isError ? <h2>Error Baby</h2> : null}

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

export default Index;
