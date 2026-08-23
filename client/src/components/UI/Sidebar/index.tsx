import {
  BsChat,
  BsCheck2All,
  BsHouse,
  BsLightningCharge,
  BsPeople,
  BsPersonAdd,
  BsPersonCheck,
} from "react-icons/bs";
import UserProfile from "../../../assets/user.jpg";
import { Flex } from "../../../lib/styled-component/styles";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import {
  useGetNotificationsQuery,
  useMarkAllNotificationsReadMutation,
  useMarkNotificationReadMutation,
} from "../../../features/api/notification";
import { selectCurrentUser } from "../../../features/slice/authSlice";
import {
  clearSocialUnread,
  setSocialUnread,
} from "../../../features/slice/inboxSlice";
import { useEffect } from "react";
import { LoaderContainer } from "../../../pages/Profile";
import Loader from "../Loader";
import {
  useAcceptRequestMutation,
  useDeclineRequestMutation,
} from "../../../features/api/user";
import { toast } from "react-hot-toast";
import {
  Icon,
  Navigation,
  NavigationLink,
  NavigationList,
  NavigationListItem,
  SideActivity,
  SideContainer,
  SideContentActivity,
  SideContentActivityBtn,
  SideContentActivityCardText,
  SideContentContainer,
  SideContentSubTitle,
  SideNewActivity,
  SideNewActivityCard,
  SidebarContainer,
} from "./styles";
import styled from "styled-components";

const notificationCopy = (n: {
  type?: string;
  message?: string;
  sender?: { username?: string };
}) => {
  if (n.message) return n.message;
  switch (n.type) {
    case "REQUEST":
      return "sent you a follow request";
    case "FOLLOW":
      return "accepted your follow request";
    case "LIKE":
      return "liked your post";
    case "COMMENT":
      return "commented on your post";
    case "TAG":
      return "tagged you in a post";
    default:
      return "sent you a notification";
  }
};

const Index = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const isAuthed = Boolean(user.token && user.user?.userId);
  const [acceptRequest] = useAcceptRequestMutation();
  const [declineRequest] = useDeclineRequestMutation();
  const [markRead] = useMarkNotificationReadMutation();
  const [markAllRead] = useMarkAllNotificationsReadMutation();
  const { data, isLoading, refetch } = useGetNotificationsQuery(undefined, {
    skip: !isAuthed,
  });

  const notifications = data?.notifications ?? [];
  const unread = notifications.filter(
    (n: { status: string }) => n.status === "RECEIVED"
  );

  // Keep navbar bell in sync with server unread activity
  useEffect(() => {
    if (!isAuthed) return;
    dispatch(setSocialUnread(unread.length));
  }, [isAuthed, unread.length, dispatch]);

  const handleAcceptRequest = async (
    senderId: string,
    notificationId: string
  ) => {
    try {
      await acceptRequest(senderId).unwrap();
      await markRead(notificationId);
      toast.success("Request accepted");
      refetch();
    } catch {
      toast.error("Could not accept request");
    }
  };

  const handleDecline = async (senderId: string, notificationId: string) => {
    try {
      await declineRequest(senderId).unwrap();
      await markRead(notificationId);
      toast.success("Request declined");
      refetch();
    } catch {
      toast.error("Could not decline request");
    }
  };

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
            <NavigationLink to={`${user.user?.username || ""}`}>
              <Icon>
                <BsPeople />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
          <NavigationListItem>
            <NavigationLink to="/">
              <Icon>
                <BsLightningCharge />
              </Icon>
            </NavigationLink>
          </NavigationListItem>
        </NavigationList>
      </Navigation>

      <SideContentContainer>
        <SideContentActivity>
          <HeaderRow>
            <h2>Activity</h2>
            {isAuthed && unread.length > 0 && (
              <MarkAllBtn
                type="button"
                onClick={async () => {
                  try {
                    await markAllRead(undefined).unwrap();
                    dispatch(clearSocialUnread());
                    refetch();
                  } catch {
                    toast.error("Could not mark all as read");
                  }
                }}
                title="Mark all as read"
              >
                <BsCheck2All />
              </MarkAllBtn>
            )}
          </HeaderRow>

          <SideNewActivity>
            <Flex>
              <SideContentSubTitle>
                Notifications{unread.length ? ` (${unread.length})` : ""}
              </SideContentSubTitle>
            </Flex>
            {isAuthed && (
              <SideContainer>
                {!isLoading ? (
                  notifications.length !== 0 ? (
                    notifications.map((notification: any) => (
                      <SideNewActivityCard
                        key={notification?._id}
                        $status={notification.status}
                      >
                        <img
                          src={notification?.sender?.image || UserProfile}
                          alt=""
                        />
                        <SideContentActivityCardText
                          $status={notification.status}
                        >
                          <span>@{notification?.sender?.username}</span>
                          <p>{notificationCopy(notification)}</p>
                        </SideContentActivityCardText>

                        {notification.type === "REQUEST" &&
                        notification.status === "RECEIVED" ? (
                          <ActionRow>
                            <SideContentActivityBtn
                              $status={notification.status}
                              onClick={() =>
                                handleAcceptRequest(
                                  notification.sender._id,
                                  notification._id
                                )
                              }
                              title="Accept"
                            >
                              <BsPersonAdd />
                            </SideContentActivityBtn>
                            <DeclineBtn
                              type="button"
                              onClick={() =>
                                handleDecline(
                                  notification.sender._id,
                                  notification._id
                                )
                              }
                              title="Decline"
                            >
                              ×
                            </DeclineBtn>
                          </ActionRow>
                        ) : notification.status === "RECEIVED" ? (
                          <SideContentActivityBtn
                            $status={notification.status}
                            onClick={() => markRead(notification._id)}
                            title="Mark as read"
                          >
                            <BsPersonCheck />
                          </SideContentActivityBtn>
                        ) : null}
                      </SideNewActivityCard>
                    ))
                  ) : (
                    <Empty>No notifications yet</Empty>
                  )
                ) : (
                  <LoaderContainer>
                    <Loader />
                  </LoaderContainer>
                )}
              </SideContainer>
            )}
          </SideNewActivity>

          <SideActivity>
            <Flex>
              <SideContentSubTitle>Tips</SideContentSubTitle>
            </Flex>
            <Tip>
              Follow people from their profile. Requests show up here so you can
              accept or decline them.
            </Tip>
          </SideActivity>
        </SideContentActivity>
      </SideContentContainer>
    </SidebarContainer>
  );
};

export default Index;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.5em;

  h2 {
    font-weight: 600;
    font-size: 1.15rem;
  }
`;

const MarkAllBtn = styled.button`
  border: none;
  background: transparent;
  color: var(--primary--color-400);
  font-size: 1.15rem;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const Empty = styled.p`
  font-size: 0.85rem;
  color: var(--txt--muted);
  margin-top: 0.75em;
`;

const Tip = styled.p`
  margin-top: 0.5em;
  padding: 0.75em;
  background: var(--dark--color-900);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--txt--muted);
  line-height: 1.4;
`;

const ActionRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.35em;
`;

const DeclineBtn = styled.button`
  width: 25px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: none;
  background: var(--danger);
  color: white;
  cursor: pointer;
  font-size: 1rem;
  line-height: 1;
`;
