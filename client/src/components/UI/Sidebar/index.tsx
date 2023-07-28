import { Link } from "react-router-dom";
import styled from "styled-components";
import {
  BsChat,
  BsHouse,
  BsLightningCharge,
  BsPeople,
  BsPersonAdd,
  BsThreeDots,
} from "react-icons/bs";
import UserProfile from "../../../assets/user.jpg";
import { Flex } from "../../../lib/styled-component/styles";
import { useAppSelector } from "../../../app/hooks";
import { useGetNotificationsQuery } from "../../../features/api/notification";
import { selectCurrentUser } from "../../../features/slice/authSlice";
import { useEffect } from "react";
import { LoaderContainer } from "../../../pages/Profile";
import Loader from "../Loader";
import { useAcceptRequestMutation } from "../../../features/api/user";
import { socket } from "../../../lib/socket/config";
import { toast } from "react-hot-toast";

const index = () => {
  const user = useAppSelector(selectCurrentUser);
  const [acceptRequest] = useAcceptRequestMutation();
  const { data, isLoading, refetch } = useGetNotificationsQuery(
    {},
    { skip: !user }
  );

  const handleAcceptRequest = async (id: string) => {
    await acceptRequest(id);
    refetch();
  };

  useEffect(() => {
    socket.on("notification", ({ sender, target, type, message }) => {
      if (target.userId === user.user?.userId) {
        toast(sender.username + " " + message);
        refetch();
      }
    });
  }, []);

  useEffect(() => {
    refetch();
  }, [user.token]);

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

          <SideNewActivity>
            <Flex>
              <SideContentSubTitle>New</SideContentSubTitle>

              <Icon>
                <BsThreeDots />
              </Icon>
            </Flex>
            {user.token && (
              <SideContainer>
                {!isLoading ? (
                  data?.notifications.length !== 0 ? (
                    data?.notifications.map((notification: any) => (
                      <SideNewActivityCard
                        key={notification?._id}
                        $status={notification.status}
                      >
                        <img src={UserProfile} alt="" />
                        <SideContentActivityCardText
                          $status={notification.status}
                        >
                          <span>{notification?.sender.username}</span>
                          <p>Follows you</p>
                        </SideContentActivityCardText>
                        <SideContentActivityBtn
                          $status={notification.status}
                          onClick={() =>
                            handleAcceptRequest(notification.sender._id)
                          }
                        >
                          <BsPersonAdd />
                        </SideContentActivityBtn>
                      </SideNewActivityCard>
                    ))
                  ) : (
                    <h3>No new Notification</h3>
                  )
                ) : (
                  <LoaderContainer>
                    <Loader />
                  </LoaderContainer>
                )}
              </SideContainer>
            )}
          </SideNewActivity>
        </SideContentActivity>
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
  h2 {
    font-weight: 600;
    font-size: 1.333rem;
  }
`;

const SideContentSubTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
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

interface IProps {
  readonly $status: string;
}

const SideNewActivityCard = styled.div<IProps>`
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

const SideContentActivityCardText = styled.div<IProps>`
  margin-left: 0.5em;
  margin-right: auto;

  span {
    font-weight: 600;
    color: ${(props) =>
      props.$status === "READ" ? "var(--light--color-600)" : ""};
  }

  p {
    font-size: 0.86rem;
    color: ${(props) =>
      props.$status === "READ" ? "var(--light--color-600)" : ""};
  }
`;

const SideContentActivityBtn = styled.div<IProps>`
  width: 25px;
  aspect-ratio: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.$status === "READ"
      ? "var(--light--color-600)"
      : "var(--primary--color-400)"};
  border-radius: 50%;
`;
