import Button from "../../Button";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Form,
  FormContainer,
  InputField,
} from "../../../lib/styled-component/styles";
import { ILoginPayload } from "../../../utils/types/types";
import { useSignInUserMutation } from "../../../features/api/auth";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../../../features/slice/authSlice";
import { useAppDispatch } from "../../../app/hooks";

const index = () => {
  const dispatch = useAppDispatch();
  const [loginUser, { isLoading }] = useSignInUserMutation();
  const Navigate = useNavigate();
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
        return;
      }

      const { data } = await loginUser(userInfo).unwrap();
      setUserInfo({ username: "", password: "" });
      console.log(data)
      dispatch(setCredentials(data));
      Navigate("/");
    } catch (error) {}
  };

  return (
    <FormContainer>
      <h2>Welcome to Back!</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum.</p>
      <Form onSubmit={onSubmit}>
        <InputField
          type="text"
          placeholder="Username"
          onChange={handleChange}
          name="username"
          value={userInfo.username}
        />
        <InputField
          type="text"
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={userInfo.password}
        />
        <Button label="Sign In" isLoading={isLoading} />
      </Form>

      <p>New to SneekPeek? Sign Up here</p>
    </FormContainer>
  );
};

export default index;
