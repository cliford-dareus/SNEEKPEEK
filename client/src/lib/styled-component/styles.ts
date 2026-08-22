import { motion } from "framer-motion";
import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PageContainer = styled(motion.div)`
  flex: 1;
  flex-shrink: 0;
  height: calc(100vh - 60px - 1em);
  overscroll-behavior-y: contain;
  overflow-y: scroll;
  position: relative;
  max-width: 500px;
  min-width: 300px;

  &::-webkit-scrollbar {
    display: none;
  }

  @media screen and (min-width: 1035px) {
    min-width: 400px;
  }
`;

export const AuthPageContainer = styled.div`
  width: 100vw;
  min-height: 100vh;
  display: flex;
  flex-direction: column-reverse;
  background: var(--dark--color-900);

  @media screen and (min-width: 900px) {
    flex-direction: row;
  }
`;

export const FormContainer = styled.div`
  width: 100%;
  max-width: 420px;
  padding: 2em 1.75em;
  background-color: var(--dark--color-800);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.06);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 1.25em;
  margin-bottom: 0.5em;

  button {
    width: 100%;
    margin-top: 0.35em;
    padding: 0.65em 1em;
  }
`;

export const InputField = styled.input`
  width: 100%;
  display: flex;
  border-radius: 12px;
  font-size: 1rem;
  padding: 0.75em 1em;
  border: 1px solid rgba(255, 255, 255, 0.1);
  outline: none;
  background-color: var(--dark--color-900);
  color: var(--txt--color-100);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--light--color-600);
  }

  &:focus {
    border-color: var(--primary--color-400);
    box-shadow: 0 0 0 3px rgba(6, 182, 212, 0.2);
  }
`;

export const AuthPageFormContainer = styled.div`
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2em 1.25em;
  overflow-y: auto;

  @media screen and (min-width: 900px) {
    flex: 0 0 48%;
    max-width: 520px;
    margin: 0 auto;
  }
`;

export const AuthPageImageContainer = styled.div`
  display: none;
  position: relative;
  overflow: hidden;

  @media screen and (min-width: 900px) {
    display: block;
    flex: 1;
    min-height: 100vh;
  }

  img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(6, 182, 212, 0.35),
      rgba(0, 0, 0, 0.55)
    );
    pointer-events: none;
  }
`;

export const PageTitle = styled.div`
  width: 100%;
  padding: 1em;
  line-height: 0.5;
  position: sticky;
  border-radius: 10px;
  z-index: 99999;
  top: 0;
  background-color: var(--dark--color-800);

  h1 {
    font-size: 1.333rem;
    font-weight: 600;
  }

  div:nth-of-type(2) {
    margin-top: 1em;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 350px;
`;
