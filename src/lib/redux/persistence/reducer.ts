import { REHYDRATE } from "redux-persist/constants";

const initialState = {
  rehydrationComplete: false,
};

export default (state = initialState, action) => {
  switch (action.type) {
    case REHYDRATE:
      return {
        rehydrationComplete: true,
      };

    default:
      return state;
  }
};
