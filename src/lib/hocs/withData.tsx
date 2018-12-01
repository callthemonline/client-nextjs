import { ApolloClient, NormalizedCacheObject } from "apollo-boost";
import Head from "next/head";
import React from "react";
import { ApolloProvider, getDataFromTree } from "react-apollo";
import initApollo from "../initApollo";

const getComponentDisplayName = (Component) =>
  Component.displayName || Component.name || "Unknown";

const isBrowser = typeof window !== "undefined";

interface WithDataPropTypes {
  serverState: {
    apollo: {
      data: object;
    };
  };
}

export default (ComposedComponent) => {
  return class WithData extends React.Component<WithDataPropTypes> {
    public static displayName = `WithData(${getComponentDisplayName(
      ComposedComponent,
    )})`;

    public static async getInitialProps(ctx) {
      // Initial serverState with apollo (empty)
      let serverState;

      const { graphqlUri, conferencePhoneNumber } =
        ctx.req || (window as any).__NEXT_DATA__.props;

      // Evaluate the composed component's getInitialProps()
      let composedInitialProps = {};
      if (ComposedComponent.getInitialProps) {
        composedInitialProps = await ComposedComponent.getInitialProps(ctx);
      }

      const apollo = initApollo({}, graphqlUri, conferencePhoneNumber);

      // Provide the `url` prop data in case a GraphQL query uses it
      const url = { query: ctx.query, pathname: ctx.pathname };

      // Run all GraphQL queries in the component tree
      // and extract the resulting data
      try {
        // Run all GraphQL queries
        await getDataFromTree(
          <ComposedComponent url={url} {...composedInitialProps} />,
          {
            router: {
              asPath: ctx.asPath,
              pathname: ctx.pathname,
              query: ctx.query,
            },
            client: apollo,
          },
        );
      } catch (error) {
        // Prevent Apollo Client GraphQL errors from crashing SSR.
        // Handle them in components via the data.error prop:
        // http://dev.apollodata.com/react/api-queries.html#graphql-query-data-error
      }

      if (!isBrowser) {
        // getDataFromTree does not call componentWillUnmount
        // head side effect therefore need to be cleared manually
        Head.rewind();
      }

      // Extract query data from the Apollo store
      serverState = {
        apollo: {
          data: apollo.cache.extract(),
        },
      };

      return {
        serverState,
        graphqlUri,
        conferencePhoneNumber,
        ...composedInitialProps,
      };
    }

    public apollo: ApolloClient<NormalizedCacheObject>;

    constructor(props) {
      super(props);
      this.apollo = initApollo(
        this.props.serverState.apollo.data,
        props.graphqlUri,
        props.conferencePhoneNumber,
      );
    }

    public render() {
      return (
        <ApolloProvider client={this.apollo}>
          <ComposedComponent {...this.props} />
        </ApolloProvider>
      );
    }
  };
};
