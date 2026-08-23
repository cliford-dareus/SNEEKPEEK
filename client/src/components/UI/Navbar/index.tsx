import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BsSearch, BsChat, BsBell, BsChevronDown } from "react-icons/bs";

import SneekLogo from "../../../assets/Sneekpeek.svg";
import Profile from "../../../assets/user.jpg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useSignOutUserMutation } from "../../../features/api/auth";
import {
  removeCredentials,
  selectCurrentUser,
} from "../../../features/slice/authSlice";
import {
  clearAllMessages,
  clearSocialUnread,
  selectSocialUnread,
  selectUnreadMessageCount,
  selectUnreadMessages,
} from "../../../features/slice/inboxSlice";
import {
  Header,
  HeaderActions,
  HeaderInput,
  HeaderInputContainer,
  HeaderProfileContainer,
  HeaderProfileModal,
  Icon,
  IconBadge,
  IconLink,
  IconWrap,
  InboxDropdown,
  InboxEmpty,
  InboxItem,
  LogoContainer,
} from "./styles";

const Index = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(selectCurrentUser);
  const unreadDms = useAppSelector(selectUnreadMessageCount);
  const unreadList = useAppSelector(selectUnreadMessages);
  const socialUnread = useAppSelector(selectSocialUnread);
  const [signout] = useSignOutUserMutation();
  const [open, setOpen] = useState(false);
  const [dmOpen, setDmOpen] = useState(false);
  const dmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (dmRef.current && !dmRef.current.contains(e.target as Node)) {
        setDmOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const handleSignout = async () => {
    try {
      await signout({});
    } finally {
      dispatch(removeCredentials());
      dispatch(clearAllMessages());
      dispatch(clearSocialUnread());
      setOpen(false);
    }
  };

  const dmLabel = unreadDms > 9 ? "9+" : String(unreadDms);
  const socialLabel = socialUnread > 9 ? "9+" : String(socialUnread);

  return (
    <Header>
      <LogoContainer to="/">
        <img src={SneekLogo} alt="SneekPeek" />
      </LogoContainer>

      <HeaderInputContainer>
        <HeaderInput type="text" placeholder="Search for post or friends..." />
        <Icon>
          <BsSearch />
        </Icon>
      </HeaderInputContainer>

      <HeaderActions>
        <IconWrap
          title="Activity"
          onClick={() => {
            dispatch(clearSocialUnread());
            navigate("/");
          }}
        >
          <Icon>
            <BsBell />
            {socialUnread > 0 && <IconBadge>{socialLabel}</IconBadge>}
          </Icon>
        </IconWrap>

        <IconWrap ref={dmRef}>
          <Icon
            title="Messages"
            onClick={() => setDmOpen((v) => !v)}
            aria-label={`Messages${unreadDms ? `, ${unreadDms} unread` : ""}`}
          >
            <BsChat />
            {unreadDms > 0 && <IconBadge>{dmLabel}</IconBadge>}
          </Icon>

          {dmOpen && (
            <InboxDropdown>
              {unreadList.length === 0 ? (
                <InboxEmpty>
                  No new messages.{" "}
                  <Link to="/messages" onClick={() => setDmOpen(false)}>
                    Open inbox
                  </Link>
                </InboxEmpty>
              ) : (
                <>
                  {unreadList.map((m) => (
                    <InboxItem
                      key={`${m.fromUsername}-${m.at}`}
                      to={`/messages`}
                      onClick={() => setDmOpen(false)}
                    >
                      <strong>@{m.fromUsername}</strong>
                      <span>{m.preview}</span>
                    </InboxItem>
                  ))}
                  <InboxItem to="/messages" onClick={() => setDmOpen(false)}>
                    <strong>View all messages</strong>
                  </InboxItem>
                </>
              )}
            </InboxDropdown>
          )}
        </IconWrap>

        <IconLink to="/messages" title="Messages inbox">
          {/* secondary entry kept via dropdown; this is optional spacing none */}
        </IconLink>

        <HeaderProfileContainer>
          <Link to={`/${user.user?.username || ""}`}>
            <img src={Profile} alt="" />
          </Link>
          <p>{user.user?.username}</p>
          <Icon onClick={() => setOpen(!open)}>
            <BsChevronDown />
          </Icon>

          {open && (
            <HeaderProfileModal>
              <Icon
                onClick={() => {
                  setOpen(false);
                  navigate(`/${user.user?.username || ""}`);
                }}
              >
                <BsBell />
                <p>Profile</p>
              </Icon>
              <Icon onClick={handleSignout}>
                <BsChat />
                <p>Sign Out</p>
              </Icon>
            </HeaderProfileModal>
          )}
        </HeaderProfileContainer>
      </HeaderActions>
    </Header>
  );
};

export default Index;
