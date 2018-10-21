import {
  ApolloClient,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from "apollo-boost";
import { setContext } from "apollo-link-context";
import { parse } from "cookie";
import fetch from "isomorphic-unfetch";
import localLink from "./graphql/state";

const isBrowser = typeof window !== "undefined";

// Polyfill fetch() on the server (used by apollo-client)
if (!isBrowser) {
  (global as any).fetch = fetch;
}

const authLink = setContext((_, { headers }) => {
  const { token } = parse(document.cookie);
  return {
    headers: {
      ...headers,
      token,
    },
  };
});

function create(initialState, graphqlUri, conferencePhoneNumber) {
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: localLink(conferencePhoneNumber).concat(
      authLink.concat(
        new HttpLink({
          uri: graphqlUri, // Server URL (must be absolute)
          credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
        }),
      ),
    ),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export default function initApollo(
  initialState,
  graphqlUri,
  conferencePhoneNumber,
): ApolloClient<NormalizedCacheObject> {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(initialState, graphqlUri, conferencePhoneNumber);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(initialState, graphqlUri, conferencePhoneNumber);
  }

  return apolloClient;
}
