import Button from "../../Button";
import { IRegisterPayload } from "../../../utils/types/types";
import { ChangeEvent, FormEvent, useState } from "react";
import {
  Form,
  FormContainer,
  InputField,
} from "../../../lib/styled-component/styles";
import { useSignUpUserMutation } from "../../../features/api/auth";

const index = () => {
  const [signUpUser, { isLoading }] =
    useSignUpUserMutation();
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
      const { username, email, password } = userInfo;
      if (!username || !email || !password) {
        console.log("All fields are require!");
        return;
      }
      await signUpUser(userInfo);
      setUserInfo({username: '', name: '', password: '', email: ''})
    } catch (error) {

    }
  };

  return (
    <FormContainer>
      <h2>Welcome to Back!</h2>
      <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Eum.</p>
      <Form onSubmit={onSubmit}>
        <InputField
          type="text"
          placeholder="Name"
          onChange={handleChange}
          name="name"
          value={userInfo.name}
          required
        />
        <InputField
          type="text"
          placeholder="Username"
          onChange={handleChange}
          name="username"
          value={userInfo.username}
          required
        />
        <InputField
          type="text"
          placeholder="Email"
          onChange={handleChange}
          name="email"
          value={userInfo.email}
          required
        />
        <InputField
          type="text"
          placeholder="Password"
          onChange={handleChange}
          name="password"
          value={userInfo.password}
          required
        />
        <Button label="Sign Up" isLoading={isLoading}/>
      </Form>

      <p>New to SneekPeek? Sign Up here</p>
    </FormContainer>
  );
};

export default index;
