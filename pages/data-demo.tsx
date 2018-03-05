import gql from "graphql-tag";
import Link from "next/link";
import { Query } from "react-apollo";
import styled from "styled-components";

import { Trans } from "react-i18next";
import Menu from "../lib/components/Menu";
import page from "../lib/hocs/page";

const H1 = styled.h1`
  color: green !important;
  margin-left: 1em;
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

export default page(["data-demo", "common"])(({ t }) => (
  <div>
    <Menu />
    <UnixTimestampQuery query={QUERY} pollInterval={300}>
      {({ data }) => (
        <H1>
          <Trans i18nKey="time">
            Time is: <b>{{ now: data.unixTimestamp }}</b>
          </Trans>!
        </H1>
      )}
    </UnixTimestampQuery>
  </div>
));
