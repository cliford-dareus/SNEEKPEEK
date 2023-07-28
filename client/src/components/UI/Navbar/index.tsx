import { useState } from "react";
import { Link } from "react-router-dom";
import { BsSearch, BsChat, BsBell, BsChevronDown } from "react-icons/bs";

<<<<<<< HEAD:client/src/components/UI/Navbar/index.tsx
import styled from "styled-components";
import SneekLogo from "../../../assets/Sneekpeek.svg";
import Profile from "../../../assets/user.jpg";
import { useAppDispatch, useAppSelector } from "../../../app/hooks";
import { useSignOutUserMutation } from "../../../features/api/auth";
import { removeCredentials, selectCurrentUser } from "../../../features/slice/authSlice";
=======
import SneekLogo from "../../assets/Sneekpeek.svg";
import Profile from "../../assets/user.jpg";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { useSignOutUserMutation } from "../../features/api/auth";
import { removeCredentials, selectCurrentUser } from "../../features/slice/authSlice";
import { Header, HeaderActions, HeaderInput, HeaderInputContainer, HeaderProfileContainer, HeaderProfileModal, Icon, LogoContainer } from "./styles";
>>>>>>> f7d35157d7acdcff195926d75b36b07504b429b6:client/src/components/Navbar/index.tsx

const Index = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);
  const [signout] = useSignOutUserMutation();
  const [open, setOpen] = useState<boolean>(false);

  const handleSignout = async () => {
    try {
      await signout({});
      dispatch(removeCredentials());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Header>
      <LogoContainer to="/">
        <img src={SneekLogo} alt="logo" />
      </LogoContainer>

      <HeaderInputContainer>
        <HeaderInput type="text" placeholder="Search for post or friends..." />
        <Icon>
          <BsSearch />
        </Icon>
      </HeaderInputContainer>

      <HeaderActions>
        <Icon>
          <BsBell />
        </Icon>
        <Icon>
          <BsChat />
        </Icon>

        <HeaderProfileContainer>
          <Link to={`${user.user?.username}`}>
            <img src={Profile} alt="" />
          </Link>
          <p>{user.user?.username}</p>
          <Icon onClick={() => setOpen(!open)}>
            {/* When drop down is open flip the icon */}
            <BsChevronDown />
          </Icon>

          {open && (
            <HeaderProfileModal>
              <Icon>
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
