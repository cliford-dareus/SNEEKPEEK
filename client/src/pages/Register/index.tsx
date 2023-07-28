import {
  AuthPageContainer,
  AuthPageFormContainer,
  AuthPageImageContainer,
} from "../../lib/styled-component/styles";
import { Register } from "../../components/AuthForm";
import Image from "../../assets/Instagram post - 1.png";

const Index = () => {
  return (
    <AuthPageContainer>
      <AuthPageImageContainer>
        <img src={Image} alt="" />
      </AuthPageImageContainer>

      <AuthPageFormContainer>
        <Register />
      </AuthPageFormContainer>
    </AuthPageContainer>
  );
};

export default Index;
