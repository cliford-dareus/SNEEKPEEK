import styled from "styled-components";

export const Flex = styled.div`
    display: flex;
`;

export const PageContainer = styled.div`
    flex: 1;
    height: calc(100vh - 60px - 1em);
    overflow-y: scroll;
    position: relative;
`;

export const PageTitle = styled.div`
    width: 100%;
    padding: 1em;
    position: sticky;
    border-radius: 10px;
    top: 0;
    background-color: var(--dark--color-800);

    h1{
        font-size: 1.7rem;
    }
`;

export const Container = styled.div`
    width: 100%;
    height: 350px;
`;