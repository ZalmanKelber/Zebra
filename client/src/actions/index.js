import axios from "axios";
import {
  FETCH_USER,
  FETCH_PROFILE,
  FETCH_POSTS,
  ADD_POST,
  UPDATE_POST,
  DELETE_POST,
  LIST_OF_PROFILES
} from "./types";

export const fetchUser = () => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.get("/api/current_user");
    document.body.style.cursor = "default";
    dispatch({type: FETCH_USER, payload: res.data});
}

export const fetchProfile = id => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.get("/user/get/" + id);
    document.body.style.cursor = "default";
    dispatch({type: FETCH_PROFILE, payload: res.data});
}

export const fetchListOfProfiles = ids => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.post("/user/list", { ids: ids });
    document.body.style.cursor = "default";
    dispatch({type: LIST_OF_PROFILES, payload: res.data});
    return;
}

export const searchProfiles = query => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.get("/user/search/" + query);
    document.body.style.cursor = "default";
    dispatch({type: LIST_OF_PROFILES, payload: res.data});
    return;
}

export const changeUserInfo = (newFields, id) => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.post("/user/update_profile/" + id, { newFields: newFields });
    document.body.style.cursor = "default";
    dispatch({type: FETCH_USER, payload: res.data});
    return;
}

export const fetchPosts = id => async dispatch => {
    document.body.style.cursor = "wait";
    const res = await axios.get("/posts/" + id);
    document.body.style.cursor = "default";
    dispatch({type: FETCH_POSTS, payload: res.data});
}

export const createPost = (content, id) => async dispatch => {
  document.body.style.cursor = "wait";
  const res = await axios.post("/posts/create/" + id, { content });
  document.body.style.cursor = "default";
  dispatch({type: ADD_POST, payload: res.data});
  return;
}

export const updatePost = (content, postId) => async dispatch => {
  document.body.style.cursor = "wait";
  const res = await axios.patch("/posts/update/" + postId, { content });
  document.body.style.cursor = "default";
  dispatch({type: UPDATE_POST, payload: {
    newPost: res.data,
    postId
  }});
  return;
}

export const toggleLike = postId => async dispatch => {
  document.body.style.cursor = "wait";
  const res = await axios.patch("/posts/toggle_like/" + postId);
  document.body.style.cursor = "default";
  dispatch({type: UPDATE_POST, payload: {
    newPost: res.data,
    postId
  }});
}

export const toggleFollow = (followedId, followerId) => async dispatch => {
  document.body.style.cursor = "wait";
  const res = await axios.patch("/user/toggle_follow/" + followedId + "/" + followerId);
  document.body.style.cursor = "default";
  dispatch({type: FETCH_USER, payload: res.data.follower});
  dispatch({type: FETCH_PROFILE, payload: res.data.followed});
}

export const deletePost = postId => async dispatch => {
  document.body.style.cursor = "wait";
  await axios.delete("/posts/delete/" + postId);
  document.body.style.cursor = "default";
  dispatch({type: DELETE_POST, payload: postId});
}
