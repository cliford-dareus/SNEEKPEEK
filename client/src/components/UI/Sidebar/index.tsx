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
import { Icon, Navigation, NavigationLink, NavigationList, NavigationListItem, SideActivity, SideContainer, SideContentActivity, SideContentActivityBtn, SideContentActivityCardText, SideContentContainer, SideContentSubTitle, SideNewActivity, SideNewActivityCard, SidebarContainer } from "./styles";

const Index = () => {
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

export default Index;

//
