import React, { Component } from "react";
import { connect } from "react-redux";
import axios from "axios";

import AddPost from "./AddPost";
import Post from "./Post";
import formatDate from "../utils/formatDate";

class CommentsDisplay extends Component {
  state = { commentObjects: [] }

  handleSave = async (content) => {
    const commentObjects = await axios.post(
      "/comments/create/" + this.props.postId,
      { content, userId: this.props.auth._id}
    );
    this.setState({ commentObjects: commentObjects.data });
  }

  handleUpdate = async (content, commentId) => {
    const commentObjects = await axios.post("/comments/update/" + commentId, { content });
    this.setState({ commentObjects: commentObjects.data });
  }

  handleDelete = async commentId => {
    const commentObjects = await axios.post("/comments/delete/" + commentId);
    this.setState({ commentObjects: commentObjects.data });
  }

  toggleLike = async commentId => {
    const commentObjects = await axios.post("/comments/toggle_like/" + commentId);
    this.setState({ commentObjects: commentObjects.data });
  }

  componentDidMount = async () => {
    const commentObjects = await axios.get("/comments/" + this.props.postId);
    this.setState({ commentObjects: commentObjects.data });
  }

  render() {
    return (
      <div className="comments-display">
      {
        this.props.auth &&
        <AddPost
          profileId={this.props.auth._id}
          postId={this.props.postId}
          isComment={true}
          handleSave={this.handleSave}
        />
      }
      {
        this.state.commentObjects.map(obj => {
          return (
            <Post
              key={obj.comment._id}
              post={obj.comment}
              isUser={String(obj.user._id) === String(this.props.auth._id)}
              postDate={formatDate(new Date(obj.comment.datePublished))}
              user={obj.user}
              handleUpdate={this.handleUpdate}
              isComment={true}
              handleLike={this.toggleLike}
              handleDelete={this.handleDelete}
            />
          );
        })
      }
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default connect(mapStateToProps)(CommentsDisplay);
