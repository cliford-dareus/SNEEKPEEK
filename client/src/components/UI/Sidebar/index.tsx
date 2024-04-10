import {
  BsChat,
  BsHouse,
  BsLightningCharge,
  BsPeople,
  BsThreeDots,
} from "react-icons/bs";
import { Flex } from "../../../lib/styled-component/styles";
import ActivitiesComponent from "../../Activities";
import {
  Icon,
  Navigation,
  NavigationLink,
  NavigationList,
  NavigationListItem,
  SideActivity,
  SideContentActivity,
  SideContentContainer,
  SideContentSubTitle,
  SidebarContainer,
} from "./styles";
import { useAppSelector } from "../../../app/hooks";
import { selectCurrentUser } from "../../../features/slice/authSlice";

const Index = () => {
  const user = useAppSelector(selectCurrentUser);
  return (
    <SidebarContainer>
      <Navigation>
        <NavigationList>
          <NavigationListItem data-active="true">
            <NavigationLink to="/">
              <Icon>
                <BsHouse />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
          <NavigationListItem>
            <NavigationLink to="messages">
              <Icon>
                <BsChat />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
          <NavigationListItem>
            <NavigationLink to={`${user.user?.username}`}>
              <Icon>
                <BsPeople />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
          <NavigationListItem>
            <NavigationLink to="">
              <Icon>
                <BsLightningCharge />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
        </NavigationList>
      </Navigation>

      <SideContentContainer>
        <SideContentActivity>
          <h2>Activity</h2>

          <SideActivity>
            <Flex>
              <SideContentSubTitle>Tagged In</SideContentSubTitle>
              <Icon>
                <BsThreeDots />
              </Icon>
            </Flex>

            <div style={{ marginTop: ".5em", height: "50px" }}>
              <div
                style={{
                  padding: ".5em 1em",
                  backgroundColor: "var(--primary--color-400)",
                  borderRadius: "10px",
                }}
              >
                Lorem, ipsum.
              </div>
            </div>
          </SideActivity>
        </SideContentActivity>
        <ActivitiesComponent  user={user}/>
      </SideContentContainer>
    </SidebarContainer>
  );
};

export default Index;

//
