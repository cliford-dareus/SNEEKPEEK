import { useCallback, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePost from "./pages/Profile/Post";
import ProfileRequest from "./pages/Profile/Requests";
import ProfileLikes from "./pages/Profile/Likes";
import ProfileTags from "./pages/Profile/Tags";
import Profile from "./pages/Profile";
import Messages from './pages/Messages'

import { useAppDispatch } from "./app/hooks";
import Layout from "./components/Layout";
import Message from "./components/SideContent/messages";
import Trending from "./components/SideContent/trending";
import Request from "./components/SideContent/request";
import DashboardLayout from "./components/DashboardLayout";
import { PrivateOutlet } from "./utils/Private/PrivateOutlet";
import { GlobalStyles } from "./lib/styled-component/globalStyles";
import { useAuth } from "./lib/hooks/useAuth";
import { useRefreshTokenMutation } from "./features/api/auth";
import { removeCredentials } from "./features/slice/authSlice";
import { setCredentials } from "./features/slice/authSlice";

function App() {
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
  }, [refreshAccessToken, auth.token]);
  
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
  }, [refreshAccessToken, auth.expiresAt, auth.token]);

  return (
    <>
      <GlobalStyles />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route path="/" element={<Layout />}>
          <Route element={<PrivateOutlet />}>
            <Route path=":name" element={<Profile />}>
              <Route index element={<ProfilePost />} />
              <Route path="likes" element={<ProfileLikes />} />
              <Route path="tags" element={<ProfileTags />} />
              <Route path="requests" element={<ProfileRequest />} />
            </Route>
            <Route path="messages" element={<Messages />}/>
          </Route>

          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<Trending />} />
            <Route path="message" element={<Message />} />
            <Route path="request" element={<Request />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default App;
