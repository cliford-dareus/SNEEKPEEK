import styled from "styled-components";
import { Flex } from "../../../../lib/styled-component/styles";
import { IFullUserResponse } from "../../../../utils/types/types";

const index = ({ currentUser }: { currentUser: IFullUserResponse }) => {
  return (
    <ProfileDetails>
      <>
        <h3>
          {currentUser?.user.username}
          <span
            style={{
              display: "block",
              fontSize: ".9rem",
              fontWeight: "normal",
              color: "var(--light--color-400)",
            }}
          >
            @{currentUser?.user.username}
          </span>
        </h3>

        <ProfileStats>
          <div>
            <span>
              {currentUser?.user.followersLength == null
                ? 0
                : currentUser?.user.followersLength}
            </span>
            <span>followers</span>
          </div>
          <div>
            <span>
              {currentUser?.user.followingsLength == null
                ? 0
                : currentUser?.user.followingsLength}
            </span>{" "}
            <span>followings</span>
          </div>
        </ProfileStats>
      </>

      <ProfileDesc>
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Fugiat,
        nostrum! kfdfldkmdfkmedcms asdmskamdsmd alksmdlkamsdas
      </ProfileDesc>
    </ProfileDetails>
  );
};

export default index;

const ProfileDetails = styled.div`
  margin-top: 4.5em;
  padding: 1em;
  width: 100%;
  align-items: center;
  background-color: var(--dark--color-800);
`;

const ProfileStats = styled(Flex)`
  gap: 1em;

  div {
    padding: 0.5em 1em;
    background-color: var(--dark--color-900);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    font-size: 0.9rem;
  }
`;

const ProfileDesc = styled.p``;
