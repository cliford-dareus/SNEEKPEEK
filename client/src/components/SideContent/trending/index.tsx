import { useMemo } from "react";
import { Container } from "../../../lib/styled-component/styles";
import { useGetPostQuery } from "../../../features/api/post";
import Loader from "../../UI/Loader";

const Index = () => {
  const { data, isLoading  } = useGetPostQuery();

  const trending = useMemo(() => {
    if (!data?.post) return null;

    const posts = data.post.slice().sort((a: any, b: any) => {
      const commentDiff = b.comments.length - a.comments.length;
      const likeDiff = b.likes.length - a.likes.length;
      const timeDiff = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();

      return commentDiff || likeDiff || timeDiff;
    });

    return posts.slice(0, 5);
  }, [data, isLoading]);

  if (isLoading) return <Container><Loader /></Container>;

  return trending ? (
    <Container>
      {trending.map(({ content }: { content: string }) => (
        <div key={content}>
          <p>{content}</p>
        </div>
      ))}
    </Container>
  ) : null;
};

export default Index;
