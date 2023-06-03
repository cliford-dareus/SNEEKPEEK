import styled from "styled-components"

const index = ({label}: {label: string}) => {
  return (
    <Button>{label}</Button>
  )
}

export default index

const Button = styled.button`
  outline: none;
  border: none;
  border-radius: 30px;
  padding: .5em;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
`;