import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../../lib/styled-component/styles";

export const CardContainer = styled.div`
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  margin: 0.85em 0;
  display: flex;
  gap: 0.9em;
  padding: 1.1em;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
`;

export const CardImage = styled(Link)`
  flex-shrink: 0;

  img {
    width: 44px;
    aspect-ratio: 1;
    background-color: var(--dark--color-700);
    border-radius: 50%;
    object-fit: cover;
    border: 1px solid var(--border-subtle);
  }
`;

export const CardContent = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

export const CardContentTop = styled(Flex)`
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5em;
`;

export const CardName = styled.p`
  font-weight: 600;
  font-size: 0.95rem;
`;

export const CardDate = styled.span`
  color: var(--txt--muted);
  display: block;
  font-size: 0.8rem;
  line-height: 1.3;
  margin-bottom: 0.65em;
`;

export const CardContentImage = styled.div`
  border-radius: var(--radius-md);
  overflow: hidden;
  margin-top: 0.85em;
  border: 1px solid var(--border-subtle);
  background: var(--dark--color-900);

  img {
    width: 100%;
    max-height: 360px;
    object-fit: cover;
  }
`;

export const CardActions = styled.div`
  margin-top: 0.9em;
  padding-top: 0.75em;
  border-top: 1px solid var(--border-subtle);
`;

export const CardActionsTop = styled.div`
  font-size: 0.8rem;
  color: var(--txt--muted);
  display: flex;
  align-items: center;
`;

export const CardActionsTopLeft = styled.div`
  display: flex;
  margin-right: auto;
  gap: 1em;

  span {
    cursor: pointer;

    &:hover {
      color: var(--primary--color-400);
    }
  }
`;

export const CardActionsBottomIcons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.65em;
`;

export const CardActionsBottomIconsLeft = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;
  gap: 0.85em;

  span,
  div {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.2rem;
    cursor: pointer;
    color: var(--light--color-400);
    transition: color 0.15s ease;

    &:hover {
      color: var(--primary--color-400);
    }
  }
`;

export const CardActionsBottomInput = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75em;
  margin: 1em 0 0;

  img {
    width: 32px;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: var(--dark--color-700);
    object-fit: cover;
  }

  input {
    flex: 1;
    border: 1px solid var(--border-strong);
    outline: none;
    background-color: var(--dark--color-900);
    border-radius: var(--radius-md);
    color: var(--txt--color-100);
    font-size: 0.9rem;
    padding: 0.55em 0.9em;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;

    &::placeholder {
      color: var(--light--color-600);
    }

    &:focus {
      border-color: var(--primary--color-400);
      box-shadow: 0 0 0 3px var(--focus-ring);
    }
  }
`;
