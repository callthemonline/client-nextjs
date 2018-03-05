import gql from "graphql-tag";
import Link from "next/link";
import { Fragment } from "react";
import { Query } from "react-apollo";
import { Trans } from "react-i18next";
import styled from "styled-components";

import Menu from "../lib/components/Menu";
import PageHeader from "../lib/components/PageHeader";
import PageLayout from "../lib/components/PageLayout";
import page from "../lib/hocs/page";

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
  <PageLayout>
    <Menu />
    <UnixTimestampQuery query={QUERY} pollInterval={300}>
      {({ data }) => (
        <PageHeader color="green">
          <Trans i18nKey="time">
            Time is: <b>{{ now: data && data.unixTimestamp }}</b>
          </Trans>!
        </PageHeader>
      )}
    </UnixTimestampQuery>
  </PageLayout>
));
