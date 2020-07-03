import { combineReducers } from "redux";

import authReducer from "./authReducer";
import viewedReducer from "./viewedReducer";
import postsReducer from "./postsReducer";
import listReducer from "./listReducer";

export default combineReducers({
  auth: authReducer,
  viewed: viewedReducer,
  posts: postsReducer,
  list: listReducer
});
