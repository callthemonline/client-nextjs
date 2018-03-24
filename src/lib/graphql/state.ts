import { withClientState } from "apollo-link-state";
import localForage from "localforage";
import { DialerInfo } from "./queries";

// TODO refactor after https://github.com/apollographql/apollo-link-state/issues/119 is resolved
let persistedPhoneNumber;
(async () => {
  persistedPhoneNumber = await localForage.getItem("dialer/PHONE_NUMBER");
})();

export default (conferencePhoneNumber) =>
  withClientState({
    resolvers: {
      Query: {
        dialer: () => ({
          __typename: "Dialer",
          phoneNumber: persistedPhoneNumber || conferencePhoneNumber,
        }),
      },
      Mutation: {
        updateDialer: (
          _,
          { input: { phoneNumber = null } = {} },
          { cache },
        ) => {
          const currentDialerQuery = cache.readQuery({
            query: DialerInfo,
            variables: {},
          });
          const updatedDialer = {
            ...currentDialerQuery.dialer,
            phoneNumber,
          };
          cache.writeQuery({
            query: DialerInfo,
            data: {
              dialer: updatedDialer,
            },
          });
          localForage.setItem("dialer/PHONE_NUMBER", phoneNumber);
          return updatedDialer;
        },
      },
    },
  });
