import { Outlet } from "react-router-dom";
import Sidebar from "../UI/Sidebar";
import Navbar from "../UI/Navbar";
import GlobalSocketListener from "../GlobalSocketListener";
import { Container, MainContainer } from "./styles";

const Index = () => {
  return (
    <Container>
      <GlobalSocketListener />
      <Navbar />
      <MainContainer>
        <Sidebar />
        <Outlet />
      </MainContainer>
    </Container>
  );
};

export default Index;
