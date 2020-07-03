import { LIST_OF_PROFILES } from "../actions/types";

export default function(state=[], action) {
  switch (action.type) {
    case LIST_OF_PROFILES:
      return action.payload || [];
    default:
      return state;
  }
}
