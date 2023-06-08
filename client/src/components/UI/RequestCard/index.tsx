import { FC } from "react";
import { IRequestData} from "../../../utils/types/types";

const index: FC<{ req: IRequestData }> = ({ req }) => {
  return <div>{req.username}</div>;
};

export default index;
