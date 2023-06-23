import styled from "styled-components";

export const Container = styled.div`
  margin-inline: 2%;
  max-width: 1140px;

  @media screen and (min-width: 425px) {
    margin-inline: 8%;
  }

  @media screen and (min-width: 605px) {
    margin-inline: 15%
  }


  @media screen and (min-width: 1440px) {
    margin-inline: auto;
  }
`;

export const MainContainer = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 1em;
  height: calc(100vh - 60px - 1em);
`;
