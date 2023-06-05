import { ReactElement } from "react";
import styled from "styled-components";

const index = ({
  icon,
  label,
  type,
  value,
  handleInput,
}: {
  icon: ReactElement;
  label: string;
  type: string;
  value: any;
  handleInput: any;
}) => {
  return (
    <Label htmlFor={type === "none" || type === "normal" ? "" : "add_file"}>
      <LabelInner>
        <span>{icon}</span>
        {label}
      </LabelInner>

      {type === "none" ? null : type === "file" ? (
        <input type="file" id="add_file" style={{ display: "none" }} />
      ) : (
        <input
          type="text"
          placeholder="eg.http://imgur.com/image-starwars.png?w=500&h=400"
          value={value}
          onChange={handleInput}
          name="image"
        />
      )}
    </Label>
  );
};

export default index;

const Label = styled.label`
  display: flex;
  flex-direction: column-reverse;
  gap: 0.5em;

  input[type="text"] {
    border: none;
    outline: none;
    background-color: var(--dark--color-800);
    display: block;
    color: white;
    font-size: 0.8rem;
    padding: 0.5em 1em;
  }
`;

const LabelInner = styled.div`
  display: flex;
  align-items: center;
  gap: 1em;
  font-size: 0.9rem;

  span {
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.3rem;
    color: var(--primary--color-400);
  }
`;
