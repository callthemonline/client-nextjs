import Link from "next/link";
import styled from "styled-components";
import withData from "../lib/hocs/withData";

const Div = styled.div`
  color: red !important;
`;

export default withData(() => (
  <div>
    <Div>
      Hello world!!!{" "}
      <Link href="/data-demo">
        <a>data-demo</a>
      </Link>
    </Div>
  </div>
));
