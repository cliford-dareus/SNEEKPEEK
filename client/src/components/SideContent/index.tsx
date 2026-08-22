import styled from "styled-components";
import { LoginForm } from "../AuthForm";
import { useAppSelector } from "../../app/hooks";
import { selectCurrentUser } from "../../features/slice/authSlice";
import React from "react";

const Index = ({ children }: { children: React.ReactNode }) => {
  const isLogin = useAppSelector(selectCurrentUser).token;

  return (
    <SideContentContainer>
      {isLogin ? (
        <SideContentTop>{children}</SideContentTop>
      ) : (
        <LoginForm />
      )}
    </SideContentContainer>
  );
};

export default Index;

const SideContentContainer = styled.aside`
  display: none;

  @media screen and (min-width: 855px) {
    display: block;
    min-width: 280px;
    max-width: 320px;
    flex: 1;
  }
`;

const SideContentTop = styled.div`
  padding: 1.1em;
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
  max-height: calc(100vh - var(--header-height) - 2em);
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--dark--color-700);
    border-radius: var(--radius-full);
  }
`;
