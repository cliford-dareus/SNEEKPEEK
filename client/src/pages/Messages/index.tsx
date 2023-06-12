import styled from "styled-components";
import { useAppSelector } from "../../app/hooks";
import SideContent from "../../components/SideContent";
import { selectCurrentUser } from "../../features/slice/authSlice";
import { BsPlusCircle } from "react-icons/bs";
import { useGetUserByUsernameQuery } from "../../features/api/user";
import { PageContainer, PageTitle } from "../../lib/styled-component/styles";
import { InputContainer } from "../Chat";
import { useGetConversationsQuery } from "../../features/api/conversations";
import SearchModal from "../../components/UI/SearchModal";
import { useEffect, useState } from "react";

const index = () => {
  const user = useAppSelector(selectCurrentUser);
  const { data: conversations, isLoading } = useGetConversationsQuery({});
  const { data: currentUserData } = useGetUserByUsernameQuery(
    user?.user?.username
  );

  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {}, [searchTerm]);

  return (
    <div style={{ flex: "1", display: "flex", gap: "1em" }}>
      <PageContainer style={{ display: "flex", flexDirection: "column" }}>
        <PageTitle>
          <InputContainer style={{ justifyContent: "space-between" }}>
            <h1>Messages</h1>
            <span>
              <BsPlusCircle />
            </span>
          </InputContainer>

          <InputContainer>
            <p style={{ marginRight: "1em" }}>To: </p>
            <Input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {searchTerm ? <SearchModal data={{ searchTerm }} /> : ""}
          </InputContainer>
        </PageTitle>

        <div style={{ flex: "1" }}>
          {!isLoading && conversations.length > 0 ? (
            <div>
              {conversations?.conversation.map((conversation: any) => (
                <p>{conversation.lastmessage}</p>
              ))}
            </div>
          ) : (
            <div>New Message</div>
          )}
        </div>
      </PageContainer>

      {/* SIDECONTENT */}
      <SideContent>
        <div style={{ height: "40px", marginBottom: "1em" }}>
          <h3>Trending</h3>
        </div>

        <SideFriendContainer>
          <h3>Friends</h3>

          <SideFriendInner>
            <p>Followers</p>
            {currentUserData
              ? currentUserData.user.followers.map((follower: any) => (
                  <div
                    style={{
                      padding: "1em",
                      backgroundColor: "var(--dark--color-900)",
                      marginTop: ".5em",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>{follower.username}</p>
                    <p>new</p>
                  </div>
                ))
              : null}
          </SideFriendInner>

          <SideFriendInner>
            <p>Followings</p>
            {currentUserData
              ? currentUserData.user.followings.map((follower: any) => (
                  <div
                    style={{
                      padding: "1em",
                      backgroundColor: "var(--dark--color-900)",
                      marginTop: ".5em",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <p>{follower.username}</p>
                    <p>new</p>
                  </div>
                ))
              : null}
          </SideFriendInner>
        </SideFriendContainer>
      </SideContent>
    </div>
  );
};

export default index;

const SideFriendContainer = styled.div``;

const SideFriendInner = styled.div`
  margin-top: 1em;

  div {
    border-radius: 10px;
  }

  p {
    font-weight: 600;
  }
`;

const Input = styled.input`
  flex: 1;
  outline: none;
  border: none;
  background-color: var(--dark--color-900);
  font-size: 1rem;
  padding: 0.5em 1em;
  color: white;
  border-radius: 10px;
`;
