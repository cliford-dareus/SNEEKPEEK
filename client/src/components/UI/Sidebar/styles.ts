import { Link } from "react-router-dom";
import styled from "styled-components";


export const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const SidebarContainer = styled.aside`
  display: none;

  @media screen and (min-width: 640px) {
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

export const Navigation = styled.nav`
  width: 50px;
  height: 100%;
  border-right: 1px solid white;

  /* flex-shrink: 0; */
  @media screen and (min-width: 635px) {
    flex-shrink: 0;
  }
`;

export const NavigationList = styled.ul`
  list-style-type: none;
`;

export const NavigationListItem = styled.li`
  width: 100%;
  height: 55px;

  &[data-active="true"] {
    background-color: var(--primary--color-400);
  }
`;

export const NavigationLink = styled(Link)`
  width: 100%;
  height: 100%;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

//Side content
export const SideContentContainer = styled.div`
  padding: 1em;
  flex: 1;
  //flex to none
`;

export const SideContentActivity = styled.div`
  width: 100%;
  /* border-bottom: 1px solid; */
  h2 {
    font-weight: 600;
    font-size: 1.333rem;
  }
`;

export const SideContentSubTitle = styled.span`
  font-size: 1rem;
  font-weight: 600;
  margin-right: auto;
`;

//Activty
export const SideActivity = styled.div`
  margin-top: 1em;
`;

//New Activity
export const SideNewActivity = styled.div`
  margin-top: 1em;
`;

export const SideContainer = styled.div`
  margin-top: 0.5em;
  height: 150px;
`;

interface IProps {
  readonly $status: string;
}

export const SideNewActivityCard = styled.div<IProps>`
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

export const SideContentActivityCardText = styled.div<IProps>`
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

export const SideContentActivityBtn = styled.div<IProps>`
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
