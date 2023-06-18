import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { useAppSelector } from "../../app/hooks";
import SideContent from "../../components/SideContent";
import styled from "styled-components";
import Button from "../../components/UI/Button";
import ProfileDetails from "./components/ProfileDetails";
import { Link, Outlet, useParams } from "react-router-dom";
import {
  useFollowUserMutation,
  useGetUserByUsernameQuery,
} from "../../features/api/user";
import { socket } from "../../lib/socket/config";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { useEffect } from "react";
import { IFullUserResponse } from "../../utils/types/types";
import toast  from "react-hot-toast";

const index = () => {
  const { name } = useParams();
  const user = useAppSelector(selectCurrentUser);
  const [followUser] = useFollowUserMutation();
  const { data: currentUser } = useGetUserByUsernameQuery(name, {
    refetchOnMountOrArgChange: true,
  });

  const onFollowUser = async () => {
    try {
      await followUser({ username: name });

      socket.emit("notification", {
        sender: {
          userId: user.user?.userId,
          username: user.user?.username,
        },
        target: {
          userId: currentUser?.user._id,
          username: currentUser?.user.username,
        },
        type: "FOLLOW",
        message: "is following you " + name,
      });
    } catch (error) {}
  };

  return (
    <div style={{ flex: "1", display: "flex", gap: "1em" }}>
      <PageContainer>
        <PageTitle>
          <h1>{currentUser?.user.username}</h1>
        </PageTitle>

        <ProfileHeader>
          <ProfileBanner>
            <img src="" alt="" />
          </ProfileBanner>

          {name !== user?.user?.username ? (
            <ProfileBtn onClick={onFollowUser}>
              <Button label="Follow" isLoading={false} color={false} />
            </ProfileBtn>
          ) : (
            <ProfileBtn>
              <Button label="Set up profile" isLoading={false} color={false} />
            </ProfileBtn>
          )}

          <ProfileDetails currentUser={currentUser as IFullUserResponse} />

          <ProfilePic></ProfilePic>
        </ProfileHeader>

        <ProfileContent>
          <ProfileActions>
            <li>
              <Link to=".">Post</Link>
            </li>
            <li>
              <Link to="likes">Likes</Link>{" "}
            </li>
            <li>
              <Link to="tags">Tags</Link>{" "}
            </li>
            {name === user.user?.username && (
              <li>
                <Link to="requests">Requests</Link>
              </li>
            )}
          </ProfileActions>

          <div>
            <div>
              <Outlet context={{ user: currentUser?.user }} />
            </div>
          </div>
        </ProfileContent>
      </PageContainer>

      <SideContent>
        <div style={{ height: "40px", marginBottom: "1em" }}>
          <h3>Trending</h3>
        </div>
      </SideContent>
    </div>
  );
};

export default index;

const ProfileHeader = styled.div`
  position: relative;
  margin-top: 1em;
`;

const ProfileBanner = styled.div`
  width: 100%;
  height: 200px;
  background-color: purple;
  border-radius: 10px;
`;

const ProfilePic = styled.div`
  position: absolute;
  top: 200px;
  left: 1em;
  transform: translateY(-50%);
  width: 120px;
  aspect-ratio: 1;
  border-radius: 50%;
  background-color: #c74bc7;
`;

const ProfileBtn = styled.div`
  position: absolute;
  right: 2em;
  top: 40%;
  top: 200px;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const ProfileActions = styled.ul`
  display: flex;
  padding: 1em 4em;
  align-content: center;
  background-color: var(--dark--color-800);
  justify-content: space-around;
`;

const ProfileContent = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
`;

export const LoaderContainer = styled.div`
  width: 50px;
  height: 60px;
  margin: 2em auto;
`;
