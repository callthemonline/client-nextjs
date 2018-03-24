import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from "apollo-client";
import { setContext } from "apollo-link-context";
import { HttpLink } from "apollo-link-http";
import { parse } from "cookie";
import fetch from "isomorphic-unfetch";
import localLink from "./graphql/state";

let apolloClient = null;

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

function create({ uri, initialState, conferencePhoneNumber }) {
  console.log("CCCC", conferencePhoneNumber);
  return new ApolloClient({
    connectToDevTools: isBrowser,
    ssrMode: !isBrowser, // Disables forceFetch on the server (so queries are only run once)
    link: localLink(conferencePhoneNumber).concat(
      authLink.concat(
        new HttpLink({
          uri, // Server URL (must be absolute)
          credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
        }),
      ),
    ),
    cache: new InMemoryCache().restore(initialState || {}),
  });
}

export default function initApollo(options) {
  // Make sure to create a new client for every server-side request so that data
  // isn't shared between connections (which would be bad)
  if (!isBrowser) {
    return create(options);
  }

  // Reuse client on the client-side
  if (!apolloClient) {
    apolloClient = create(options);
  }

  return apolloClient;
}
