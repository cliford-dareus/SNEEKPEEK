import { Flex } from "../../lib/styled-component/styles";
import styled from "styled-components";
import SideContent from '../SideContent'
import Explore from "../../pages/Home";


const index = () => {
  return (
    <DashboardLayoutContainer>
      <Flex style={{ height: "100%", gap: "1em" }}>
        <Explore />
        <SideContent />
      </Flex>
    </DashboardLayoutContainer>
  );
};

export default index;

const DashboardLayoutContainer = styled.div`
  flex: 1;
`;


