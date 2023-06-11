import { useCallback, useEffect } from "react";
import { useAuth } from "./useAuth";
import { useRefreshTokenMutation } from "../../features/api/auth";
import { useAppDispatch } from "../../app/hooks";
import { useNavigate } from "react-router-dom";
import {
  removeCredentials,
  setCredentials,
} from "../../features/slice/authSlice";

const useRefreshToken = () => {
  const auth = useAuth();
  const [refresh] = useRefreshTokenMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const refreshAccessToken = useCallback(async () => {
    try {
      const data = await refresh({}).unwrap();
      if (data?.status === 204) {
        dispatch(removeCredentials());
        navigate("/login");
      } else {
        dispatch(setCredentials(data?.user));
        // navigate(".");
      }
    } catch (error) {
      dispatch(removeCredentials());
    }
  }, [refresh, removeCredentials]);

  useEffect(() => {
    // if(auth.token === '') return
    refreshAccessToken();
  }, [refreshAccessToken]);

  useEffect(() => {
    let refreshAccessTokenTimerId: any;
    if (auth.token) {
      refreshAccessTokenTimerId = setTimeout(() => {
        refreshAccessToken();
      }, new Date(auth.expiresAt).getTime() - Date.now() - 10 * 1000);
    }

    return () => {
      if (auth.token && refreshAccessTokenTimerId) {
        clearTimeout(refreshAccessTokenTimerId);
      }
    };
  }, [refreshAccessToken]);
};

export default useRefreshToken;
