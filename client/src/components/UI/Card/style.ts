import { Link } from "react-router-dom";
import styled from "styled-components";
import { Flex } from "../../../lib/styled-component/styles";


export const CardContainer = styled.div`
  background-color: var(--dark--color-800);
  margin: 1em 0;
  display: flex;
  gap: 1em;
  padding: 1em;
  border-radius: 10px;
`;

export const CardImage = styled(Link)`
  /* width: 20%; */

  img {
    width: 45px;
    aspect-ratio: 1;
    background-color: aliceblue;
    border-radius: 50%;
  }
`;

export const CardContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const CardContentTop = styled(Flex)`
  justify-content: space-between;
`;

export const CardName = styled.p`
  font-weight: 600;
`;

export const CardDate = styled.span`
  color: var(--light--color-400);
  display: block;
  line-height: 0.9;
  margin-bottom: 1em;
`;

export const CardContentImage = styled.div`
  border-radius: 10px;
  overflow: hidden;
  margin-top: 1em;
`;

export const CardActions = styled.div`
  margin-top: 1em;
`;

export const CardActionsTop = styled.div`
  font-size: 0.85rem;
  color: var(--light--color-400);
  display: flex;
`;

export const CardActionsTopLeft = styled.div`
  display: flex;
  margin-right: auto;

  span {
    margin-right: 1em;
  }
`;

export const CardActionsBottomIcons = styled.div`
  display: flex;
  align-items: center;
  margin-top: 0.5em;
`;

export const CardActionsBottomIconsLeft = styled.div`
  display: flex;
  align-items: center;
  margin-right: auto;

  span {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-right: 1em;
    font-size: 1.3rem;
  }
`;

export const CardActionsBottomInput = styled.div`
  display: flex;
  margin: 1em 0;

  img {
    width: 30px;
    aspect-ratio: 1;
    border-radius: 50%;
    background-color: aliceblue;
  }

  input {
    flex: 1;
    margin-left: 1em;
    margin-right: auto;
    border: none;
    outline: none;
    background-color: var(--dark--color-900);
    border-radius: 10px;
    color: white;
    font-size: 0.9rem;
  }
`;