import { Flex } from "../../lib/styled-component/styles";
import SideContent from "../SideContent";
import Explore from "../../pages/Home";
import { Outlet } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useGetUserByUsernameQuery } from "../../features/api/user";
import { useState } from "react";
import { ActiveIndicator, DashboardLayoutContainer, SideContentMenu, SideContntBtn } from "./styles";

const links = [
  { id: 1, to: ".", title: "Trending" },
  { id: 2, to: "message", title: "Messages" },
  { id: 3, to: "request", title: "Requests" },
];

const Index = () => {
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

export default Index;