import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

export const DashboardLayoutContainer = styled.div`
  flex: 1;
`;

export const SideContentMenu = styled.ul`
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 40px;
  margin-bottom: 1em;
`;

export const SideContntBtn = styled(NavLink)`
  outline: none;
  border: none;
  padding: 0.3em 0;
  font-size: 1rem;
  font-weight: 600;
  color: white;
`;

export const ActiveIndicator = styled(motion.div)`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: white;
`;
