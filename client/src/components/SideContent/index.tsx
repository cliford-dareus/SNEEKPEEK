
import styled from "styled-components";
import { LoginForm } from "../AuthForm";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/slice/authSlice";
import React from "react";

const index = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useAppSelector(selectCurrentUser).token;

  return (
    <SideContentContainer>
      {isLogin ? (
        <div>
          <SideContentTop>{children}</SideContentTop>
          {/* <div>
            <h3>Friends</h3>
          </div> */}
        </div>
      ) : (
        <LoginForm />
      )}
    </SideContentContainer>
  );
};

export default index;

const SideContentContainer = styled.aside`
  display: none;

  @media screen and (min-width: 855px) {
    display: block;
    border-radius: 10px;
    width: 350px;
  }
`;

const SideContentTop = styled.div`
  padding: 1em;
  background-color: var(--dark--color-800);
`;


