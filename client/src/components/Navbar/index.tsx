import { Link } from "react-router-dom";
import styled from "styled-components";
import SneekLogo from "../../assets/Sneekpeek.svg";
import { BsSearch, BsChat, BsBell, BsChevronDown } from "react-icons/bs";
import Profile from "../../assets/user.jpg";

const index = () => {
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
          <img src={Profile} alt="" />
          <p>Harry_webert</p>
          <Icon>
            <BsChevronDown />
          </Icon>
        </HeaderProfileContainer>
      </HeaderActions>
    </Header>
  );
};

export default index;

//Global style
const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
`;

const Header = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderInputContainer = styled.div`
  display: none;

  @media screen and (min-width: 635px) {
    width: 30%;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    background-color: var(--dark--color-800);
    margin-right: auto;
    padding-inline: 1em;
    margin-left: 1.7em;
  }

  @media screen and (min-width: 1035px) {
    margin-left: 17.5em;
  }


`;

const LogoContainer = styled(Link)`
  img {
    width: 35px;
    aspect-ratio: 1;
  }
`;

const HeaderInput = styled.input`
  display: none;

  @media screen and (min-width: 635px) {
    display: block;
    height: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    color: white;
    margin-right: auto;
    /* padding-inline: 1em; */
    flex: 1;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

const HeaderProfileContainer = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 0.3em;
  padding-right: 1em;
  border-radius: 3em;
  background-color: var(--dark--color-800);

  img {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-right: 0.5em;
  }

  p {
    display: none;

    @media screen and (min-width: 435px) {
      display: block;
      margin-right: 0.5em;
    }
  }
`;
