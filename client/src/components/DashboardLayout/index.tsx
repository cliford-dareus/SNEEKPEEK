import { Flex } from "../../lib/styled-component/styles";
import styled from "styled-components";
import SideContent from "../SideContent";
import Explore from "../../pages/Home";
import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useGetUserByUsernameQuery } from "../../features/api/user";
import { useState } from "react";
import { motion } from "framer-motion";

const links = [
  { id: 1, to: ".", title: "Trending" },
  { id: 2, to: "message", title: "Messages" },
  { id: 3, to: "request", title: "Requests" },
];

const index = () => {
  const [activeTab, setActiveTab] = useState<number>(links[0].id);
  const auth = useAuth();
  const { data: currentUser } = useGetUserByUsernameQuery(
    auth?.user?.username,
    { skip: auth.user?.username === "" }
  );

  return (
    <DashboardLayoutContainer>
      <Flex style={{ height: "100%", gap: "1em" }}>
        <Explore />
        <SideContent>
          <SideContentMenu>
            {links.map((link) => (
              <li style={{ position: "relative" }}>
                <SideContntBtn
                  to={link.to}
                  key={link.id}
                  onClick={(isActive) =>
                    isActive ? setActiveTab(link.id) : ""
                  }
                >
                  {link.title}
                  {activeTab == link.id && (
                    <ActiveIndicator
                      layoutId="Tab"
                      transition={{
                        type: "spring",
                        bounce: 0.3,
                        duration: 0.7,
                      }}
                    />
                  )}
                </SideContntBtn>
              </li>
            ))}
          </SideContentMenu>
          <div>
            <Outlet context={{ user: currentUser?.user }} />
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

const SideContntBtn = styled(NavLink)`
  outline: none;
  border: none;
  padding: 0.3em 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
`;
