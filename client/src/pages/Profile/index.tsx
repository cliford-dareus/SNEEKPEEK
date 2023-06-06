import { PageTitle } from "../../lib/styled-component/styles";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../app/hooks";

const index = () => {
  const user = useAppSelector((state) => state.auth.user?.username);

  return (
    <div>
      <PageTitle>
        <h1>Profile</h1>
      </PageTitle>
      <div>{user ? <p>{user}</p> : <Loader />}</div>
    </div>
  );
};

export default index;
