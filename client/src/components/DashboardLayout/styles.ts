import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const DashboardLayoutContainer = styled.div`
  flex: 1;
  min-width: 0;
`;

export const SideContentMenu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5em;
  height: 44px;
  margin-bottom: 1em;
  padding-bottom: 0.25em;
  border-bottom: 1px solid var(--border-subtle);
`;

export const SideContntBtn = styled(NavLink)`
  outline: none;
  border: none;
  padding: 0.35em 0.15em;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--txt--muted);
  transition: color 0.15s ease;

  &:hover,
  &.active {
    color: var(--txt--color-100);
  }
`;

export const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--primary--color-400);
  border-radius: var(--radius-full);
`;
