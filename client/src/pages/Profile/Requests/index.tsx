import { Link, useOutletContext } from "react-router-dom"
import { useAcceptRequestMutation } from "../../../features/api/user";

const index = () => {
  const [accept] = useAcceptRequestMutation()
  const { user } =useOutletContext() as any;


  return (
    <div>{user.request.map((req: any) => (
      <button onClick={() => accept(req._id)}>{req.username}</button>
    ))}</div>
  )
}

export default index