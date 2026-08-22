import { motion } from "framer-motion";
import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

/** Standard elevated panel used across feed, sidebars, cards */
export const Surface = styled.div`
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-sm);
`;

export const PageContainer = styled(motion.div)`
  flex: 1;
  flex-shrink: 0;
  height: calc(100vh - var(--header-height) - 1em);
  overscroll-behavior-y: contain;
  overflow-y: auto;
  position: relative;
  max-width: 560px;
  min-width: 280px;
  padding-bottom: 1.5em;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--dark--color-700);
    border-radius: var(--radius-full);
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
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-md);
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
  border-radius: var(--radius-md);
  font-size: 1rem;
  padding: 0.75em 1em;
  border: 1px solid var(--border-strong);
  outline: none;
  background-color: var(--dark--color-900);
  color: var(--txt--color-100);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;

  &::placeholder {
    color: var(--light--color-600);
  }

  &:focus {
    border-color: var(--primary--color-400);
    box-shadow: 0 0 0 3px var(--focus-ring);
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
  padding: 1em 1.15em;
  line-height: 1.2;
  position: sticky;
  border-radius: var(--radius-md);
  z-index: 50;
  top: 0;
  background-color: var(--dark--color-800);
  border: 1px solid var(--border-subtle);
  box-shadow: var(--shadow-sm);
  margin-bottom: 0.75em;

  h1 {
    font-size: 1.25rem;
    font-weight: 600;
    letter-spacing: -0.01em;
  }

  div:nth-of-type(2) {
    margin-top: 1em;
  }
`;

export const Container = styled.div`
  width: 100%;
  max-height: 420px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--dark--color-700);
    border-radius: var(--radius-full);
  }
`;

export const EmptyState = styled.p`
  text-align: center;
  padding: 2em 1em;
  color: var(--txt--muted);
  font-size: 0.95rem;
`;
