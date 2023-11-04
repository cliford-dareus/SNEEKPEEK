import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  cursor: pointer;
`;

export const Header = styled.header`
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const HeaderInputContainer = styled.div`
  display: none;

  @media screen and (min-width: 792px) {
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
    margin-left: 1.9em;
  }

  @media screen and (min-width: 1435px) {
    margin-left: 18.5em;
  }
`;

export const LogoContainer = styled(Link)`
  img {
    width: 35px;
    aspect-ratio: 1;
  }
`;

export const HeaderInput = styled.input`
  display: none;

  @media screen and (min-width: 792px) {
    display: block;
    height: 100%;
    outline: none;
    border: none;
    background-color: transparent;
    color: white;
    margin-right: auto;
    font-size: 0.8125rem;
    /* padding-inline: 1em; */
    flex: 1;
  }
`;

export const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
`;

export const HeaderProfileContainer = styled.div`
  display: flex;
  height: 40px;
  align-items: center;
  padding-left: 0.3em;
  padding-right: 1em;
  border-radius: 3em;
  background-color: var(--dark--color-800);
  position: relative;
  isolation: isolated;

  img {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-right: 0.5em;
  }

  p {
    display: none;
    max-width: 25ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;

    @media screen and (min-width: 435px) {
      display: block;
      margin-right: 0.5em;
    }
  }
`;

export const HeaderProfileModal = styled(motion.div)`
  position: absolute;
  top: 100%;
  right: 0;
  width: 200px;
  padding: 1em;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5em;
  background-color: var(--primary--color-400);
  z-index: 999999;

  span {
    display: flex;
    align-items: center;
    gap: 1em;
    transition: all 0.3s ease-in-out;

    &:hover {
      color: var(--primary--color-300);
    }

    p {
      font-size: 1rem;
    }
  }
`;