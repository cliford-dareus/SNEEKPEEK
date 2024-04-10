import {
  Icon,
  SideContainer,
  SideContentActivityBtn,
  SideContentActivityCardText,
  SideContentSubTitle,
  SideNewActivity,
  SideNewActivityCard,
} from "../UI/Sidebar/styles";
import UserProfile from "../../assets/user.jpg";
import { Flex } from "../../lib/styled-component/styles";
import { BsPersonAdd, BsThreeDots } from "react-icons/bs";
import { LoaderContainer } from "../../pages/Profile";
import Loader from "../UI/Loader";
import { useGetNotificationsQuery } from "../../features/api/notification";
import { useAcceptRequestMutation } from "../../features/api/user";
import { useEffect } from "react";
import { socket } from "../../lib/socket/config";
import toast from "react-hot-toast";

type Props = {
    user: any
};

const Index = ({user}: Props) => {
 
  const [acceptRequest] = useAcceptRequestMutation();
  const { data, isLoading, refetch } = useGetNotificationsQuery(undefined, {
    skip: !user,
  });

  console.log(data?.notifications);

  const handleAcceptRequest = async (id: string) => {
    await acceptRequest(id);
    refetch();
  };

  useEffect(() => {
    socket.on("notification", ({ sender, target, message }) => {
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
    <SideNewActivity>
      <Flex>
        <SideContentSubTitle>New</SideContentSubTitle>
        <Icon>
          <BsThreeDots />
        </Icon>
      </Flex>
      {user.token ? (
        <SideContainer>
          {!isLoading ? (
            data?.notifications.length !== 0 ? (
              data?.notifications.map((notification: any) => (
                <SideNewActivityCard
                  key={notification?._id}
                  $status={notification.status}
                >
                  <img src={UserProfile} alt="" />
                  <SideContentActivityCardText $status={notification.status}>
                    <span>{notification?.sender.username}</span>
                    <p>Follows you</p>
                  </SideContentActivityCardText>
                  <SideContentActivityBtn
                    $status={notification.status}
                    onClick={() => handleAcceptRequest(notification.sender._id)}
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
      ) : (
        <p>Please Login</p>
      )}
    </SideNewActivity>
  );
};

export default Index;
