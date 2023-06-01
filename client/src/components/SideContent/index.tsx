import { Outlet } from "react-router";
import { Link } from "react-router-dom";
import styled from "styled-components";

const index = () => {
  return (
    <SideContentContainer>
      <div>
        <div>
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
        </div>

        <div>
          <h3>Friends</h3>
        </div>
      </div>
    </SideContentContainer>
  );
};

export default index;

const SideContentContainer = styled.aside`
  width: 285px;
  background-color: var(--dark--color-800);
  height: 100%;
  border-radius: 10px;
  padding: 1em;
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
