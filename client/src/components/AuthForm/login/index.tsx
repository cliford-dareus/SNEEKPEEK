import Button from "../../Button";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Form,
  FormContainer,
  InputField,
} from "../../../lib/styled-component/styles";

const index = () => {
  const [userInfo, setUserInfo] = useState({ username: "", password: "" });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  //   console.log(userInfo);

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
        <Button label="Sign In" />
      </Form>

      <p>New to SneekPeek? Sign Up here</p>
    </FormContainer>
  );
};

export default index;
