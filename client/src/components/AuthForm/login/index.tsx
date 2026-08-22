import Button from "../../UI/Button";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Form,
  FormContainer,
  InputField,
} from "../../../lib/styled-component/styles";
import { ILoginPayload } from "../../../utils/types/types";
import { useSignInUserMutation } from "../../../features/api/auth";
import { Link, useNavigate } from "react-router-dom";
import { setCredentials } from "../../../features/slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";
import { socketConnect } from "../../../lib/socket/config";
import toast from "react-hot-toast";
import styled from "styled-components";

const Index = () => {
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useSignInUserMutation();
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState<ILoginPayload>({
    username: "",
    password: "",
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { username, password } = userInfo;
      if (!username || !password) {
        toast.error("Please enter your username and password");
        return;
      }

      const data = await loginUser(userInfo).unwrap();
      setUserInfo({ username: "", password: "" });
      dispatch(setCredentials(data.user));
      socketConnect({
        token: data.user.accessToken,
        user: { username: data.user.username, userId: data.user.userId },
        expiresAt: data.user.expiresAt,
      });
      toast.success("Welcome back!");
      navigate("/", { replace: true });
    } catch {
      toast.error("Invalid username or password");
    }
  };

  return (
    <FormContainer>
      <Brand>SneekPeek</Brand>
      <Title>Welcome back</Title>
      <Subtitle>
        Sign in to catch up with friends, share updates, and join the
        conversation.
      </Subtitle>
      <Form onSubmit={onSubmit}>
        <FieldGroup>
          <Label htmlFor="login-username">Username</Label>
          <InputField
            id="login-username"
            type="text"
            placeholder="your_username"
            onChange={handleChange}
            name="username"
            value={userInfo.username}
            autoComplete="username"
            required
          />
        </FieldGroup>
        <FieldGroup>
          <Label htmlFor="login-password">Password</Label>
          <InputField
            id="login-password"
            type="password"
            placeholder="••••••••"
            onChange={handleChange}
            name="password"
            value={userInfo.password}
            autoComplete="current-password"
            required
          />
        </FieldGroup>
        <Button label="Sign in" isLoading={isLoading} color={true} />
      </Form>

      <FooterText>
        New to SneekPeek?{" "}
        <FooterLink to="/register">Create an account</FooterLink>
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
