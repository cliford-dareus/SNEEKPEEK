import { PageContainer } from "../../lib/styled-component/styles";
import Loader from "../../components/Loader";
import { useAppSelector } from "../../app/hooks";
import SideContent from "../../components/SideContent";
import styled from "styled-components";

const index = () => {
  const user = useAppSelector((state) => state.auth.user?.username);

  return (
    <div style={{ flex: "1", display: "flex", gap: "1em" }}>
      <PageContainer>
        {/* <PageTitle>
          <h1>Profile</h1>
        </PageTitle> */}

        <ProfileHeader>
          <ProfileBanner>
            <img src="" alt="" />
          </ProfileBanner>
        </ProfileHeader>

        <div>
          <ul>
            <li>Post</li>
            <li></li>
            <li>Tag</li>
            <li>Likes</li>
          </ul>
        </div>
        <div>{user ? <p>{user}</p> : <Loader />}</div>
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

const ProfileHeader = styled.div``;

const ProfileBanner = styled.div``;


