import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { useAppSelector } from "../../app/hooks";
import SideContent from "../../components/SideContent";
import styled from "styled-components";
import Button from "../../components/UI/Button";
import BackButton from "../../components/UI/BackButton";
import ProfileDetails from "./components/ProfileDetails";
import { NavLink, Outlet, useParams } from "react-router-dom";
import {
  useFollowUserMutation,
  useGetUserByUsernameQuery,
} from "../../features/api/user";
import { socket } from "../../lib/socket/config";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { IFullUserResponse } from "../../utils/types/types";
import Trending from "../../components/SideContent/trending";
import toast from "react-hot-toast";

const Index = () => {
  const { name } = useParams();
  const user = useAppSelector(selectCurrentUser);
  const [followUser, { isLoading: isFollowing }] = useFollowUserMutation();
  const { data: currentUser } = useGetUserByUsernameQuery(name, {
    refetchOnMountOrArgChange: true,
  });

  const onFollowUser = async () => {
    if (!name || !user.user) return;

    try {
      const result = await followUser({ username: name }).unwrap();

      const target = result?.target || {
        userId: currentUser?.user._id,
        username: currentUser?.user.username,
      };

      socket.emit("notification", {
        sender: {
          userId: user.user.userId,
          username: user.user.username,
        },
        target,
        type: "REQUEST",
        message: "sent you a follow request",
      });

      toast.success("Follow request sent");
    } catch (error: any) {
      const msg =
        error?.data?.message || "Could not send follow request";
      toast.error(msg);
    }
  };

  return (
    <ProfileLayout>
      <PageContainer>
        <PageTitle
          style={{ display: "flex", alignItems: "center", gap: "1em" }}
        >
          <BackButton />
          <h1>{currentUser?.user.username ?? name}</h1>
        </PageTitle>

        <ProfileHeader>
          <ProfileBanner />

          {name !== user?.user?.username ? (
            <ProfileBtn onClick={onFollowUser}>
              <Button
                label="Follow"
                isLoading={isFollowing}
                color={true}
              />
            </ProfileBtn>
          ) : (
            <ProfileBtn>
              <Button label="Set up profile" isLoading={false} color={false} />
            </ProfileBtn>
          )}

          <ProfileDetails currentUser={currentUser as IFullUserResponse} />

          <ProfilePic aria-hidden />
        </ProfileHeader>

        <ProfileContent>
          <ProfileActions>
            <li>
              <TabLink to="." end>
                Posts
              </TabLink>
            </li>
            <li>
              <TabLink to="likes">Likes</TabLink>
            </li>
            <li>
              <TabLink to="tags">Tags</TabLink>
            </li>
            {name === user.user?.username && (
              <li>
                <TabLink to="requests">Requests</TabLink>
              </li>
            )}
          </ProfileActions>

          <Outlet context={{ user: currentUser?.user }} />
        </ProfileContent>
      </PageContainer>

      <SideContent>
        <SideHeading>Trending</SideHeading>
        <Trending />
      </SideContent>
    </ProfileLayout>
  );
};

export default Index;

const ProfileLayout = styled.div`
  flex: 1;
  display: flex;
  gap: var(--content-gap);
  min-width: 0;
`;

const ProfileHeader = styled.div`
  position: relative;
  margin-top: 0.5em;
  margin-bottom: 4.5em;
`;

const ProfileBanner = styled.div`
  width: 100%;
  height: 160px;
  background: linear-gradient(
    135deg,
    var(--primary--color-500),
    var(--primary-color--900)
  );
  border-radius: var(--radius-md);
  border: 1px solid var(--border-subtle);
`;

const ProfilePic = styled.div`
  position: absolute;
  top: 160px;
  left: 1em;
  transform: translateY(-50%);
  width: 96px;
  aspect-ratio: 1;
  border-radius: 50%;
  background: var(--dark--color-700);
  border: 3px solid var(--dark--color-900);
  box-shadow: var(--shadow-sm);
`;

const ProfileBtn = styled.div`
  position: absolute;
  right: 1em;
  top: 160px;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
`;

const ProfileActions = styled.ul`
  display: flex;
  padding: 0 0.5em;
  align-items: center;
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  justify-content: space-around;
  margin-bottom: 0.75em;
`;

const TabLink = styled(NavLink)`
  display: block;
  padding: 0.9em 0.75em;
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--txt--muted);
  border-bottom: 2px solid transparent;
  transition: color 0.15s ease, border-color 0.15s ease;

  &:hover {
    color: var(--txt--color-100);
  }

  &.active {
    color: var(--primary--color-400);
    border-bottom-color: var(--primary--color-400);
  }
`;

const ProfileContent = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: column;
`;

const SideHeading = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.85em;
`;

export const LoaderContainer = styled.div`
  width: 50px;
  height: 60px;
  margin: 2em auto;
`;
