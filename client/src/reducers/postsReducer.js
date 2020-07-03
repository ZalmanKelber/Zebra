import { FETCH_POSTS, ADD_POST, UPDATE_POST, DELETE_POST } from "../actions/types";

export default function(state=[], action) {
  switch (action.type) {
    case FETCH_POSTS:
      return action.payload || [];
    case ADD_POST:
      return action.payload ? [ action.payload, ...state] : state;
    case UPDATE_POST:
      return state.map(post => post._id === action.payload.postId ? action.payload.newPost : post);
    case DELETE_POST:
      return state.filter(post => post._id !== action.payload);
    default:
      return state;

  }
}
