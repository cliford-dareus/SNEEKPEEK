import { useGetPostQuery } from "../../features/api/post";
import { IPost } from "../../utils/types/types";
import Featured from "./components/CreatePost";
import Loader from "../../components/UI/Loader";
import Card from "../../components/UI/Card";
import { useAuth } from "../../lib/hooks/useAuth";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { useEffect, useMemo } from "react";
import { socket } from "../../lib/socket/config";
import { toast } from "react-hot-toast";
import styled from "styled-components";
// import { motion } from "framer-motion";

const Index = () => {
  const auth = useAuth();
  const { data, isLoading } = useGetPostQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  const sortedData = useMemo(() => {
    return data?.post
      ?.slice()
      .sort(
        (a: any, b: any) => Date.parse(b.createdAt) - Date.parse(a.createdAt)
      );
  }, [data]);

  useEffect(() => {
    const onNotification = ({ sender, target, message }: any) => {
      if (target.userId === auth.user?.userId) {
        toast(sender.username + " " + message);
      }
    };

    socket.on("notification", onNotification);
    return () => {
      socket.off("notification", onNotification);
    };
  }, [auth.user?.userId]);

  if (isLoading) {
    return (
      <PageContainer>
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <PageTitle>
        <h1>Explore</h1>
      </PageTitle>
      {auth.token && <Featured />}
      {sortedData?.map((post: IPost) => (
        <Card key={post._id} post={post} />
      ))}
    </PageContainer>
  );
};

export default Index;

const LoaderContainer = styled.div``;
