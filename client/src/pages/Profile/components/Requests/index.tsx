import { useOutletContext } from "react-router-dom";
import RequestCard from "../../../../components/UI/RequestCard";
import { IRequestData } from "../../../../utils/types/types";


const index = () => {
  const { user } = useOutletContext() as any;

  return (
    <div>
      {user?.request.map((req: IRequestData) => (
        <RequestCard req={req} />
      ))}
    </div>
  );
};

export default index;
