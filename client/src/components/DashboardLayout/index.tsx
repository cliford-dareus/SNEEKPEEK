import { Flex } from "../../lib/styled-component/styles";
import styled from "styled-components";
import SideContent from '../SideContent'
import Explore from "../../pages/Home";
import { Link, Outlet } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useGetUserByUsernameQuery } from "../../features/api/user";


const index = () => {
  const auth = useAuth()
  const { data: currentUser } = useGetUserByUsernameQuery(auth.user?.username);
  return (
    <DashboardLayoutContainer>
      <Flex style={{ height: "100%", gap: "1em" }}>
        <Explore />
        <SideContent>
          <SideContentMenu>
              <li>
                <SideContntBtn to="." data-active="true">
                  Messages
                </SideContntBtn>
              </li>
              <li>
                <SideContntBtn to="mention">Mentions</SideContntBtn>
              </li>
              <li>
                <SideContntBtn to="request">Requests</SideContntBtn>
              </li>
            </SideContentMenu>
            <div>
              <Outlet context={{ user: currentUser?.user }}/>
            </div>
        </SideContent>
      </Flex>
    </DashboardLayoutContainer>
  );
};

export default index;

const DashboardLayoutContainer = styled.div`
  flex: 1;
`;

const SideContentMenu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 1em;
`;

const SideContntBtn = styled(Link)`
  outline: none;
  border: none;
  padding: 0.3em 0;
  color: white;
  font-size: 1rem;
  font-weight: bold;

  &[data-active="true"] {
    border-bottom: 2px solid white;
  }
`;


