import { useMemo } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { IAuthInitialState } from "../../utils/types/types";

export const useAuth = () => {
  const user = useSelector(selectCurrentUser) as IAuthInitialState;
  return useMemo(() => user, [user]);
};
