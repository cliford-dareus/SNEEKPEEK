import { Outlet } from "react-router-dom";
<<<<<<< HEAD
import Sidebar from "../UI/Sidebar";
import Navbar from "../UI/Navbar";
import styled from "styled-components";
=======
import Sidebar from "../Sidebar";
import Navbar from "../Navbar";
import { Container, MainContainer } from "./styles";
>>>>>>> f7d35157d7acdcff195926d75b36b07504b429b6


const Index = () => {
  

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

export default Index;
