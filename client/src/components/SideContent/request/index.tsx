import { useOutletContext } from "react-router-dom";
import { Container } from "../../../lib/styled-component/styles";
import RequestCard from "../../UI/RequestCard";
import { IRequestData } from "../../../utils/types/types";
import { useGetUserByUsernameQuery } from "../../../features/api/user";

const Index = () => {
  const { user } = useOutletContext() as any;
  const { data, isLoading } = useGetUserByUsernameQuery(user?.username);

  return (
    <Container>
      <div>
        {!isLoading &&
          data?.user.request.map((req: IRequestData) => (
            <RequestCard req={req} />
          ))}
      </div>
    </Container>
  );
};

export default Index;
