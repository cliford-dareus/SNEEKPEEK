import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import styled from "styled-components";

const index = () => {
  return (
    <Container>
      <Navbar />
      <MainContainer>
        <Sidebar />
        <Outlet />
      </MainContainer>
    </Container>
  );
};

export default index;

const Container = styled.div`
  margin-inline: 7%;
`;

const MainContainer = styled.div`
  display: flex;
  gap: 1em;
  margin-top: 1em;
  height: calc(100vh - 60px - 1em);
`;

