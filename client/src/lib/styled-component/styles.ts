import styled from "styled-components";

export const Flex = styled.div`
  display: flex;
`;

export const FlexCol = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PageContainer = styled.div`
  flex: 1;
  flex-shrink: 0;
  min-width: 400px;
  height: calc(100vh - 60px - 1em);
  overflow-y: scroll;
  position: relative;
`;

export const AuthPageContainer = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column-reverse;
  gap: 1em;

  @media screen and (min-width: 1135px) {
    flex-direction: row;
  }
`;

export const FormContainer = styled.div`
  padding: 1em;
  background-color: var(--dark--color-800);
  border-radius: 10px;
`;

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1em;
  margin-top: 1em;
  margin-bottom: 1em;
`;

export const InputField = styled.input`
  width: 100%;
  display: flex;
  border-radius: 30px;
  font-size: 1.1rem;
  padding: 0.5em 1em;
  border: none;
  outline: none;
  /* margin-top: 1em; */
`;

export const AuthPageFormContainer = styled.div`
  height: 60%;
  display: flex;
  justify-content: center;
  align-items: center;

  @media screen and (min-width: 1135px) {
    height: auto;
    width: 400px;
    justify-content: center;
  }
`;

export const AuthPageImageContainer = styled.div`
  height: 40%;
  position: relative;

  @media screen and (min-width: 1135px) {
    width: 50%;
    height: 100%;
  }

  img {
    position: absolute;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;

export const PageTitle = styled.div`
  width: 100%;
  padding: 1em;
  position: sticky;
  border-radius: 10px;
  top: 0;
  background-color: var(--dark--color-800);

  h1 {
    font-size: 1.7rem;
  }
`;

export const Container = styled.div`
  width: 100%;
  height: 350px;
`;
