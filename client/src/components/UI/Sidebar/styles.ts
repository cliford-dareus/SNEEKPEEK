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
    width: 52px;
    min-width: 52px;
    height: fit-content;
    max-height: calc(100vh - var(--header-height) - 2em);
    background-color: var(--dark--color-800);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    overflow: hidden;
    display: flex;
    box-shadow: var(--shadow-sm);
  }

  @media screen and (min-width: 1235px) {
    width: 280px;
  }
`;

export const Navigation = styled.nav`
  width: 100%;
  height: 100%;
`;

export const NavigationList = styled.ul`
  list-style-type: none;
  padding: 0.4em;
`;

export const NavigationListItem = styled.li`
  width: 100%;
  height: 48px;
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 0.25em;

  &[data-active="true"] {
    background-color: rgba(6, 182, 212, 0.15);

    a {
      color: var(--primary--color-400);
    }
  }

  &:hover:not([data-active="true"]) {
    background-color: var(--dark--color-750);
  }
`;

export const NavigationLink = styled(Link)`
  width: 100%;
  height: 100%;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75em;
  color: var(--light--color-400);
  padding: 0 0.75em;
  transition: color 0.15s ease;

  @media screen and (min-width: 1235px) {
    justify-content: flex-start;
    font-size: 1.1rem;
  }
`;

export const SideContentContainer = styled.div`
  padding: 1em;
  flex: 1;
`;

export const SideContentActivity = styled.div`
  width: 100%;

  h2 {
    font-weight: 600;
    font-size: 1.15rem;
  }
`;

export const SideContentSubTitle = styled.span`
  font-size: 0.95rem;
  font-weight: 600;
  margin-right: auto;
  color: var(--txt--muted);
`;

export const SideActivity = styled.div`
  margin-top: 1em;
`;

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
  padding: 0.5em;
  border-radius: var(--radius-sm);
  transition: background-color 0.15s ease;

  &:hover {
    background-color: var(--dark--color-750);
  }

  img {
    width: 40px;
    aspect-ratio: 1;
    border-radius: 50%;
    object-fit: cover;
  }
`;

export const SideContentActivityCardText = styled.div<IProps>`
  margin-left: 0.5em;
  margin-right: auto;

  span {
    font-weight: 600;
    color: ${(props) =>
      props.$status === "READ" ? "var(--light--color-600)" : "inherit"};
  }

  p {
    font-size: 0.86rem;
    color: ${(props) =>
      props.$status === "READ" ? "var(--light--color-600)" : "var(--txt--muted)"};
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
