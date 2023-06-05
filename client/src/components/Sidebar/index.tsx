import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  BsChat,
  BsHouse,
  BsPeople,
  BsPersonAdd,
  BsThreeDots,
} from "react-icons/bs";
import UserProfile from "../../assets/user.jpg";
import { Flex } from "../../lib/styled-component/styles";

const index = () => {
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
            <NavigationLink to="/">
              <Icon>
                <BsChat />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
          <NavigationListItem>
            <NavigationLink to="/profile">
              <Icon>
                <BsPeople />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
        </NavigationList>
      </Navigation>

      <SideContentContainer>
        <SideContentActivity>
          <h2>Activities</h2>

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

          <SideNewActivity>
            <Flex>
              <SideContentSubTitle>New</SideContentSubTitle>

              <Icon>
                <BsThreeDots />
              </Icon>
            </Flex>
            <SideContainer>
              {Array(3)
                .fill(0)
                .map((_) => (
                  <SideNewActivityCard>
                    <img src={UserProfile} alt="" />
                    <SideContentActivityCardText>
                      <span>James Rodrigez</span>
                      <p>Follows you</p>
                    </SideContentActivityCardText>
                    <SideContentActivityBtn>
                      <BsPersonAdd />
                    </SideContentActivityBtn>
                  </SideNewActivityCard>
                ))}
            </SideContainer>
          </SideNewActivity>
        </SideContentActivity>

        <SideGroupContainer>{/* <h2>Groups</h2> */}</SideGroupContainer>
      </SideContentContainer>
    </SidebarContainer>
  );
};

export default index;

//
const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SidebarContainer = styled.aside`
  display: none;

  @media screen and (min-width: 635px) {
    width: 49px;
    min-width: 49px;
    height: 50%;
    background-color: var(--dark--color-800);
    border-radius: 10px;
    overflow: hidden;
    display: flex;
  }

  @media screen and (min-width: 1235px) {
    width: 300px;
  }
`;

const Navigation = styled.nav`
  width: 50px;
  height: 100%;
  border-right: 1px solid white;

  /* flex-shrink: 0; */
  @media screen and (min-width: 635px) {
    flex-shrink: 0;
  }
`;

const NavigationList = styled.ul`
  list-style-type: none;
`;

const NavigationListItem = styled.li`
  width: 100%;
  height: 55px;

  &[data-active="true"] {
    background-color: var(--primary--color-400);
  }
`;

const NavigationLink = styled(Link)`
  width: 100%;
  height: 100%;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

//Side content
const SideContentContainer = styled.div`
  padding: 1em;
  flex: 1;
  //flex to none
`;

const SideContentActivity = styled.div`
  width: 100%;
  /* border-bottom: 1px solid; */
`;

const SideContentSubTitle = styled.span`
  font-size: 1rem;
  font-weight: bold;
  margin-right: auto;
`;

//Activty
const SideActivity = styled.div`
  margin-top: 1em;
`;

//New Activity
const SideNewActivity = styled.div`
  margin-top: 1em;
`;

const SideContainer = styled.div`
  margin-top: 0.5em;
  height: 150px;
`;

const SideNewActivityCard = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5em;
  cursor: pointer;

  img {
    width: 40px;
    aspect-ratio: 1;
    border-radius: 50%;
  }
`;

const SideContentActivityCardText = styled.div`
  margin-left: 0.5em;
  margin-right: auto;

  span {
    font-size: 0.9rem;
    font-weight: bold;
  }

  p {
    font-size: 0.825rem;
  }
`;

const SideContentActivityBtn = styled.div`
  width: 25px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--primary--color-400);
  border-radius: 50%;
`;
//New Activity End

const SideGroupContainer = styled.div`
  margin-top: 1em;
`;
