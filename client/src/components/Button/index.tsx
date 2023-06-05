import styled from "styled-components";
import Loader from "../../components/Loader";

const index = ({
  label,
  isLoading,
  color,
}: {
  label: string;
  isLoading: boolean;
  color?: boolean;
}) => {
  return (
    //Add styling for btn disabled
    <Button disabled={isLoading} $bg={color} >
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

interface BgProp {
  readonly $bg: boolean;
}

const Button = styled.button<BgProp>`
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: none;
  border-radius: 30px;
  padding: 0.5em 1em;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  background-color: ${(props) =>
    props.$bg === true ? "var(--primary--color-400)" : ""};
  color: ${(props) => (props.$bg === true ? "white" : "")};
`;
