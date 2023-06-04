import styled from "styled-components";
import Loader from "../../components/Loader";

const index = ({ label, isLoading }: { label: string; isLoading: boolean }) => {
  return (
    //Add styling for btn disabled
    <Button disabled={isLoading}>
      {!isLoading ? (
        <p>{label}</p>
      ) : (
        <div style={{ width: "59px", height: "18.5px" }}>
          <Loader />
        </div>
      )}
    </Button>
  );
};

export default index;

const Button = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  border-radius: 30px;
  padding: 0.5em;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
`;
