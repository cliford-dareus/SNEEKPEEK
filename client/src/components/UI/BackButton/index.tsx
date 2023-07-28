import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const index = () => {
  const Navigate = useNavigate();
  return (
    <BackArrow onClick={() => Navigate(-1)}>
      <BsArrowLeft />
    </BackArrow>
  );
};

export default index;

const BackArrow = styled.span`
  cursor: pointer;
  font-size: 1.5rem;
`;
