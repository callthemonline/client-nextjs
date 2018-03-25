import styled from "styled-components";

const Loading = styled.div`
  display: flex;
  flex-grow: 1;
  position: relative;
  transition: all 0.5s ease-in-out;
  align-items: center;
  justify-content: center;
  font-size: 150px;
  opacity: 0.1;
`;

export default () => <Loading>🤙</Loading>;
