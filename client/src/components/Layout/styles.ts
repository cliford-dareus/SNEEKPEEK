import styled from "styled-components";

export const Container = styled.div`
  margin-inline: 4%;
  max-width: 1200px;

  @media screen and (min-width: 640px) {
    margin-inline: 6%;
  }

  @media screen and (min-width: 1024px) {
    margin-inline: 8%;
  }

  @media screen and (min-width: 1440px) {
    margin-inline: auto;
    padding-inline: 1em;
  }
`;

export const MainContainer = styled.div`
  display: flex;
  gap: var(--content-gap);
  margin-top: 1em;
  height: calc(100vh - var(--header-height) - 1em);
  align-items: flex-start;
`;
