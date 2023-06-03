import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";
import LoginForm from "../LoginForm";

const index = () => {
  const isLogin = false;
  return (
    <SideContentContainer>
      {isLogin ? (
        <div>
          <SideContentTop>
            <SideContentMenu>
              <li>
                <SideContntBtn to="." data-active="true">
                  Messages
                </SideContntBtn>
              </li>
              <li>
                <SideContntBtn to="mention">Mentions</SideContntBtn>
              </li>
              <li>
                <SideContntBtn to="request">Requests</SideContntBtn>
              </li>
            </SideContentMenu>

            <div>
              <Outlet />
            </div>
          </SideContentTop>

          <div>
            <h3>Friends</h3>
          </div>
        </div>
      ) : (
        <LoginForm />
      )}
    </SideContentContainer>
  );
};

export default index;

const SideContentContainer = styled.aside`
  display: none;
  /* background-color: var(--dark--color-800); */
  /* height: 100%; */

  @media screen and (min-width: 785px) {
    display: block;
    border-radius: 10px;
    width: 350px;
  }
`;

const SideContentTop = styled.div`
  padding: 1em;
  background-color: var(--dark--color-800);
`;

const SideContentMenu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 1em;
`;

const SideContntBtn = styled(Link)`
  outline: none;
  border: none;
  padding: 0.3em 0;
  color: white;
  font-size: 1rem;
  font-weight: bold;

  &[data-active="true"] {
    border-bottom: 2px solid white;
  }
`;
