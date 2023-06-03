import styled from "styled-components";
import Button from "../Button";
import { ChangeEvent, FormEvent, useState } from "react";

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

const FormContainer = styled.div`
  padding: 1em;
  background-color: var(--dark--color-800);
  border-radius: 10px;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
`;

const InputField = styled.input`
  width: 100%;
  display: flex;
  border-radius: 30px;
  font-size: 1.1rem;
  padding: 0.5em 1em;
  border: none;
  outline: none;
  /* margin-top: 1em; */
`;
