import Button from "../../UI/Button";
import { IRegisterPayload } from "../../../utils/types/types";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Form,
  FormContainer,
  InputField,
} from "../../../lib/styled-component/styles";
import { useSignUpUserMutation } from "../../../features/api/auth";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import styled from "styled-components";

const Index = () => {
  const navigate = useNavigate();
  const [signUpUser, { isLoading }] = useSignUpUserMutation();
  const [userInfo, setUserInfo] = useState<IRegisterPayload>({
    username: "",
    name: "",
    password: "",
    email: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { username, email, password, name } = userInfo;
      if (!username || !email || !password || !name) {
        toast.error("Please fill in all fields");
        return;
      }

      if (password.length < 8) {
        toast.error("Password must be at least 8 characters");
        return;
      }

      await signUpUser(userInfo).unwrap();
      setUserInfo({ username: "", name: "", password: "", email: "" });
      toast.success("Account created! Please sign in.");
      navigate("/login", { replace: true });
    } catch (error: any) {
      const status = error?.status ?? error?.originalStatus;
      if (status === 409) {
        toast.error("That email or username is already taken");
      } else {
        toast.error("Could not create account. Please try again.");
      }
    }
  };

  return (
    <FormContainer>
      <Brand>SneekPeek</Brand>
      <Title>Create your account</Title>
      <Subtitle>
        Join SneekPeek to share posts, follow friends, and chat in real time.
      </Subtitle>
      <Form onSubmit={onSubmit}>
        <FieldGroup>
          <Label htmlFor="register-name">Full name</Label>
          <InputField
            id="register-name"
            type="text"
            placeholder="Jane Doe"
            onChange={handleChange}
            name="name"
            value={userInfo.name}
            autoComplete="name"
            required
            minLength={4}
            maxLength={20}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="register-username">Username</Label>
          <InputField
            id="register-username"
            type="text"
            placeholder="janedoe"
            onChange={handleChange}
            name="username"
            value={userInfo.username}
            autoComplete="username"
            required
            minLength={4}
            maxLength={20}
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="register-email">Email</Label>
          <InputField
            id="register-email"
            type="email"
            placeholder="you@example.com"
            onChange={handleChange}
            name="email"
            value={userInfo.email}
            autoComplete="email"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="register-password">Password</Label>
          <InputField
            id="register-password"
            type="password"
            placeholder="At least 8 characters"
            onChange={handleChange}
            name="password"
            value={userInfo.password}
            autoComplete="new-password"
            required
            minLength={8}
          />
        </FieldGroup>
        <Button label="Sign up" isLoading={isLoading} color={true} />
      </Form>

      <FooterText>
        Already have an account?{" "}
        <FooterLink to="/login">Sign in</FooterLink>
      </FooterText>
    </FormContainer>
  );
};

export default Index;

const Brand = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--primary--color-400);
  margin-bottom: 0.5em;
`;

const Title = styled.h2`
  font-size: 1.6rem;
  font-weight: 600;
  margin-bottom: 0.35em;
`;

const Subtitle = styled.p`
  color: var(--light--color-400);
  font-size: 0.95rem;
  line-height: 1.45;
  margin-bottom: 0.25em;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35em;
`;

const Label = styled.label`
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--light--color-400);
`;

const FooterText = styled.p`
  margin-top: 1.25em;
  text-align: center;
  font-size: 0.95rem;
  color: var(--light--color-400);
`;

const FooterLink = styled(Link)`
  color: var(--primary--color-400);
  font-weight: 600;

  &:hover {
    text-decoration: underline;
  }
`;
