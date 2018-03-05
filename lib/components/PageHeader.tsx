import styled from "styled-components";

export default styled.h1`
  color: ${(p) => p.color || "black"} !important;
`;
