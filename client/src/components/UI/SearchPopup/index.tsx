import React, { useEffect, useState } from "react";
import styled from "styled-components";

interface IProp {
  currentUserData: any;
  setReciepient: React.Dispatch<
    React.SetStateAction<{
      userId: string;
      username: string;
    }>
  >;
  openReciepientList: boolean;
  setOpenReciepientList: React.Dispatch<React.SetStateAction<boolean>>;
  searchWord: string;
}

const index = ({
  currentUserData,
  setReciepient,
  openReciepientList,
  setOpenReciepientList,
  searchWord,
}: IProp) => {
  return (
    <ReciepientPickerModal>
      {openReciepientList && !searchWord
        ? currentUserData.user.followers.map((follower: any) => (
            <div
              style={{
                padding: "1em",
                backgroundColor: "var(--dark--color-900)",
                marginTop: ".5em",
                cursor: "pointer",
              }}
              onClick={() =>
                setReciepient({
                  userId: follower._id,
                  username: follower.username,
                })
              }
            >
              <p>{follower.username}</p>
            </div>
          ))
        : null}
    </ReciepientPickerModal>
  );
};

export default index;

const ReciepientPickerModal = styled.div`
  position: absolute;
  top: 3.5em;
  left: 50%;
  transform: translateX(-50%);
  width: 80%;
  /* height: 200px; */
  padding: 1em;
  /* z-index: 9999; */
  background-color: var(--dark--color-800);
  border-radius: 10px;

  p {
    padding: 0.5em;
  }
`;
