import styled from "styled-components";
import Label from "../Label";
import { BsImage, BsLink45Deg, BsXLg } from "react-icons/bs";
import React from "react";

interface Iprop {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  value: any;
  handleInput: any;
}

const index = ({ setOpenModal, value, handleInput }: Iprop) => {
  return (
    <CreatePostModalContainer>
      <Button onClick={() => setOpenModal(false)}>
        <BsXLg />
      </Button>

      <Label
        label="Add Local Files"
        icon={<BsImage />}
        type="file"
        value=""
        handleInput=""
      />
      <Label
        label="Add Image Link"
        icon={<BsLink45Deg />}
        type="normal"
        value={value}
        handleInput={handleInput}
      />
    </CreatePostModalContainer>
  );
};

export default index;

const CreatePostModalContainer = styled.div`
  position: absolute;
  width: 80%;
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--dark--color-900);
  padding: 2em;
  border-radius: 10px;
  display: flex;
  flex-direction: column;
  gap: 2em;
`;

const Button = styled.button`
  position: absolute;
  top: 1em;
  right: 1em;
  border: none;
  outline: none;
  color: var(--primary--color-400);
  background-color: transparent;
  font-size: 1.5rem;
`;
