import { Container } from "../../../lib/styled-component/styles";
import { useGetConversationsQuery } from "../../../features/api/conversations";
import { useMemo } from "react";
import { useAppSelector } from "../../../app/hooks";

const Index = () => {
  const { data: conversations, isLoading } = useGetConversationsQuery();
  const user = useAppSelector((state) => state.auth.user);
  console.log(user)

  const lastConversation = useMemo(() => {
    if (!conversations) return null;

    return conversations?.conversation.slice()
      .sort((a: any, b: any) => {
        return (
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
      })
      .slice(0, 5);
  }, [conversations, isLoading]);

  console.log(lastConversation)

  return (
    <Container>
      {lastConversation?.map(({_id, lastmessage }: { _id: string, lastmessage: string }) => (
        <p key={_id}>{lastmessage}</p>
      ))}
    </Container>
  );
};

export default Index;
