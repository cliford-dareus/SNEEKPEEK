import { Flex } from "../../lib/styled-component/styles";
import SideContent from "../SideContent";
import Explore from "../../pages/Home";
import { Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../../lib/hooks/useAuth";
import { useGetUserByUsernameQuery } from "../../features/api/user";
import {
  ActiveIndicator,
  DashboardLayoutContainer,
  SideContentMenu,
  SideContntBtn,
} from "./styles";
import React from "react";

const links = [
  { id: 1, to: ".", title: "Trending" },
  { id: 2, to: "message", title: "Messages" },
  { id: 3, to: "request", title: "Requests" },
];

const Index = () => {
  const auth = useAuth();
  const { pathname } = useLocation();
  const [activeTab, setActiveTab] = React.useReducer(
    (state: number, action: { type: "SET_ACTIVE_TAB"; payload: number }) =>
      action.type === "SET_ACTIVE_TAB" ? action.payload : state,
    links.find(({ to }) => pathname === "/" + to)?.id || 1
  );

  const { data: currentUser, isLoading } = useGetUserByUsernameQuery(
    auth?.user?.username,
    { skip: !auth.user?.username }
  );

  const MemoizedSideContentMenu = React.useMemo(
    () => (
      <SideContentMenu>
        {links.map(({ id, to, title }) => (
          <li key={id}>
            <SideContntBtn
              to={to}
              onClick={() =>
                setActiveTab({ type: "SET_ACTIVE_TAB", payload: id })
              }
            >
              {title}
              {activeTab === id && <ActiveIndicator layoutId="Tab" />}
            </SideContntBtn>
          </li>
        ))}
      </SideContentMenu>
    ),
    [activeTab]
  );

  if (isLoading) return <div>Loading...</div>;

  return (
    <DashboardLayoutContainer>
      <Flex style={{ height: "100%", gap: "1em" }}>
        <Explore />
        <SideContent>
          {MemoizedSideContentMenu}
          <div>
            <Outlet context={{ user: currentUser?.user }} />
          </div>
        </SideContent>
      </Flex>
    </DashboardLayoutContainer>
  );
};

export default Index;
