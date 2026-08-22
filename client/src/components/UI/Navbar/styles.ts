import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import styled from "styled-components";

export const Icon = styled.span`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.1rem;
  cursor: pointer;
  color: var(--light--color-400);
  transition: color 0.15s ease;

  &:hover {
    color: var(--primary--color-400);
  }
`;

export const Header = styled.header`
  width: 100%;
  height: var(--header-height);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1em;
  padding: 0 0.25em;
  border-bottom: 1px solid var(--border-subtle);
`;

export const HeaderInputContainer = styled.div`
  display: none;

  @media screen and (min-width: 792px) {
    width: min(40%, 360px);
    height: 40px;
    border-radius: var(--radius-full);
    display: flex;
    align-items: center;
    background-color: var(--dark--color-800);
    border: 1px solid var(--border-subtle);
    margin-right: auto;
    padding-inline: 1em;
    margin-left: 1.5em;
    gap: 0.5em;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &:focus-within {
      border-color: var(--primary--color-400);
      box-shadow: 0 0 0 3px var(--focus-ring);
    }
  }
`;

export const LogoContainer = styled(Link)`
  display: flex;
  align-items: center;

  img {
    width: 36px;
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
    color: var(--txt--color-100);
    margin-right: auto;
    font-size: 0.875rem;
    flex: 1;

    &::placeholder {
      color: var(--light--color-600);
    }
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
  padding-right: 0.85em;
  border-radius: var(--radius-full);
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  position: relative;
  isolation: isolate;

  img {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    margin-right: 0.5em;
    object-fit: cover;
  }

  p {
    display: none;
    max-width: 16ch;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 0.9rem;
    font-weight: 500;

    @media screen and (min-width: 435px) {
      display: block;
      margin-right: 0.35em;
    }
  }
`;

export const HeaderProfileModal = styled(motion.div)`
  position: absolute;
  top: calc(100% + 0.5em);
  right: 0;
  width: 200px;
  padding: 0.5em;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.15em;
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
  z-index: 999999;

  span {
    display: flex;
    align-items: center;
    gap: 0.75em;
    padding: 0.65em 0.75em;
    border-radius: var(--radius-sm);
    color: var(--txt--color-100);
    cursor: pointer;
    transition: background-color 0.15s ease;

    &:hover {
      background-color: var(--dark--color-750);
      color: var(--primary--color-400);
    }

    p {
      font-size: 0.9rem;
      font-weight: 500;
    }
  }
`;
