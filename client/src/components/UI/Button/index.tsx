import styled from "styled-components";
import Loader from "../Loader";

const Index = ({
  label,
  isLoading,
  color,
}: {
  label: string;
  isLoading: boolean;
  color?: boolean;
}) => {
  return (
    <Button disabled={isLoading} $bg={color}>
      {!isLoading ? (
        <span>{label}</span>
      ) : (
        <div style={{ width: "59px", height: "18.5px" }}>
          <Loader />
        </div>
      )}
    </Button>
  );
};

export default Index;

interface BgProp {
  readonly $bg: boolean | undefined;
}

const Button = styled.button<BgProp>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  outline: none;
  border: 1px solid
    ${(props) =>
      props.$bg === true ? "transparent" : "var(--border-strong)"};
  border-radius: var(--radius-full);
  padding: 0.55em 1.25em;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.15s ease, border-color 0.15s ease,
    opacity 0.15s ease, transform 0.1s ease;
  background-color: ${(props) =>
    props.$bg === true ? "var(--primary--color-400)" : "var(--dark--color-750)"};
  color: ${(props) =>
    props.$bg === true ? "#fff" : "var(--txt--color-100)"};

  &:hover:not(:disabled) {
    background-color: ${(props) =>
      props.$bg === true
        ? "var(--primary--color-500)"
        : "var(--dark--color-700)"};
  }

  &:active:not(:disabled) {
    transform: scale(0.98);
  }

  &:disabled {
    opacity: 0.65;
    cursor: not-allowed;
  }
`;
