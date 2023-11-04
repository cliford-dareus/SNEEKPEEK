import { useOutletContext } from "react-router-dom";
import { Container } from "../../../lib/styled-component/styles";
import RequestCard from "../../UI/RequestCard";
import { IRequestData } from "../../../utils/types/types";

const Index = () => {
  const { user } = useOutletContext() as any;

  return (
    <Container>
      <div>
        {user?.request.map((req: IRequestData) => (
          <RequestCard req={req} />
        ))}
      </div>
    </Container>
  );
};

export default Index;
