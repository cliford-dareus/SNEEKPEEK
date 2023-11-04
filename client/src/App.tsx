import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProfilePost from "./pages/Profile/components/Post";
import ProfileRequest from "./pages/Profile/components/Requests";
import ProfileLikes from "./pages/Profile/components/Likes";
import ProfileTags from "./pages/Profile/components/Tags";
import Profile from "./pages/Profile";
import Messages from "./pages/Messages";
import Chat from "./pages/Chat";

import Layout from "./components/Layout";
import Message from "./components/SideContent/messages";
import Trending from "./components/SideContent/trending";
import Request from "./components/SideContent/request";
import DashboardLayout from "./components/DashboardLayout";

import useRefreshToken from "./lib/hooks/useRefreshToken";
import { GlobalStyles } from "./lib/styled-component/globalStyles";
import { PrivateOutlet } from "./utils/Private/PrivateOutlet";
import { useAppSelector } from "./app/hooks";
import { selectCurrentUser } from "./features/slice/authSlice";

function App() {
  const _ = useRefreshToken();
  // const user = useAppSelector(selectCurrentUser);

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

            <Route path="messages" element={<Messages />} />
            <Route path="messages/chat/:name/:id" element={<Chat />} />
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
