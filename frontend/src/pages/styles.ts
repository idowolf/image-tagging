import styled from "styled-components";

export const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 20px;
  margin: auto;
  width: 80%;
  text-align: center;

  &.auth {
    max-width: 500px;
  }
`;
