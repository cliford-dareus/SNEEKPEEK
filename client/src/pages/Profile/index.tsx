import {
  Flex,
  PageContainer,
  PageTitle,
} from "../../lib/styled-component/styles";
// import { useAppSelector } from "../../app/hooks";
import SideContent from "../../components/SideContent";
import styled from "styled-components";
import Button from "../../components/Button";
import { useParams } from "react-router-dom";
import { useFollowUserMutation, useGetUserByUsernameQuery } from "../../features/api/user";
import { useGetUserPostQuery } from "../../features/api/post";
import Card from "../../components/Card";
import Loader from "../../components/Loader";

const index = () => {
  const { name } = useParams();
  const { data: currentUser } = useGetUserByUsernameQuery(name);
  const { data: post, isLoading } = useGetUserPostQuery(name);
  // const user = useAppSelector((state) => state.auth.user?.username);
  const [followUser] = useFollowUserMutation();

  const onFollowUser =async () => {
    try {
      await followUser({username: name})
    } catch (error) {
      
    }
  }

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

          <ProfileBtn onClick={onFollowUser}>
            <Button label="Follow" isLoading={false} color={false}/>
          </ProfileBtn>

          <ProfileDetails>
            <div>
              <h3>
                {currentUser?.user.username}
                <span
                  style={{
                    display: "block",
                    fontSize: ".9rem",
                    fontWeight: "normal",
                    color: "var(--light--color-400)",
                  }}
                >
                  @{currentUser?.user.username}
                </span>
              </h3>

              <ProfileStats>
                <div>
                  <span>
                    {currentUser?.user.followesLength == null
                      ? 0
                      : currentUser?.user.followesLength}{" "}
                  </span>{" "}
                  <span>followers</span>
                </div>
                <div>
                  <span>1.3k </span> <span>followings</span>
                </div>
              </ProfileStats>
            </div>

            <ProfileDesc>
              Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat,
              nostrum! kfdfldkmdfkmedcms asdmskamdsmd alksmdlkamsdas
            </ProfileDesc>
          </ProfileDetails>

          <ProfilePic></ProfilePic>
        </ProfileHeader>

        <ProfileContent>
          <ProfileActions>
            <li>Post</li>
            <li>Likes</li>
            <li>Tag</li>
            <li>Requests</li>
          </ProfileActions>

          <div>
            <div>
              {!isLoading ? (
                post?.post.map((post: any) => <Card post={post} />)
              ) : (
                <Loader />
              )}
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

const ProfileStats = styled(Flex)`
  gap: 1em;

  div {
    padding: 0.5em 1em;
    background-color: var(--dark--color-900);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
`;

const ProfileDetails = styled.div`
  margin-top: 4.5em;
  padding: 1em;
  width: 100%;
  align-items: center;
  background-color: var(--dark--color-800);
`;

const ProfileDesc = styled.p``;

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
  padding: 1em;
  background-color: var(--dark--color-800);
  justify-content: space-between;
`;

const ProfileContent = styled.div`
  margin-top: 1em;
`;
