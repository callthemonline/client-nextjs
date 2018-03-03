import gql from "graphql-tag";
import Link from "next/link";
import { Query } from "react-apollo";
import styled from "styled-components";
import withData from "../lib/hocs/withData";

const Div = styled.div`
  color: red !important;
`;

const QUERY = gql`
  query {
    unixTimestamp
  }
`;

export interface GetCharacterQuery {
  unixTimestamp: number;
}

class UnixTimestampQuery extends Query<GetCharacterQuery, null> {}

export default withData(() => (
  <UnixTimestampQuery query={QUERY} pollInterval={300}>
    {({ data }) => (
      <Div>
        time is: {data.unixTimestamp}!<br />
        <Link href="/">
          <a>back to home page</a>
        </Link>
      </Div>
    )}
  </UnixTimestampQuery>
));
