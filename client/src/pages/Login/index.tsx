import { LoginForm } from "../../components/AuthForm";
import {
  AuthPageContainer,
  AuthPageFormContainer,
  AuthPageImageContainer,
} from "../../lib/styled-component/styles";
import Image from "../../assets/Instagram post - 1.png";

const Index = () => {
  return (
    <AuthPageContainer>
      <AuthPageImageContainer>
        <img src={Image} alt="SneekPeek — connect and share with friends" />
      </AuthPageImageContainer>

      <AuthPageFormContainer>
        <LoginForm />
      </AuthPageFormContainer>
    </AuthPageContainer>
  );
};

export default Index;
