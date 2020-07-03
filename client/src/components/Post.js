import React, { Component } from "react";
import { connect } from "react-redux";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { Link } from "react-router-dom";

import { renderCanvas } from "../utils/renderCanvas";
import * as actions from "../actions";
import CommentsDisplay from "./CommentsDisplay";

class Post extends Component {
  state = {
    edit: false ,
    htmlContent: this.props.post.content,
    showComments: false,
    deleteConfirm: false,
    isComment: this.props.isComment,
    showComments: false,
    exceedMessage: false
  }

  handleEdit = e => {
    e.preventDefault();
    this.setState({ edit: true })
  }

  handleDelete = e => {
    e.preventDefault();
    this.setState({ deleteConfirm: true})
  }

  handleChange = content => {
    if (content.length < 300) {
      this.setState({ htmlContent: content, exceedMessage: false });
    }
    else {
      this.setState({ exceedMessage: true });
    }
  }

  handleCancel = e => {
    e.preventDefault();
    this.setState({
      edit: false,
      htmlContent: this.props.post.content,
      deleteConfirm: false
    });
  }

  handleSave = async e => {
    e.preventDefault();
    if (this.props.isComment) {
      await this.props.handleUpdate(this.state.htmlContent, this.props.post._id);
    }
    else {
      await this.props.updatePost(this.state.htmlContent, this.props.post._id);
    }
    this.setState({
      edit: false,
      htmlContent: this.props.post.content
    });
  }

  handleDeleteConfirm = e => {
    e.preventDefault();
    if (this.props.isComment) {
      this.props.handleDelete(this.props.post._id);
    }
    else {
      this.props.deletePost(this.props.post._id);
    }
  }

  handleLike = async e => {
    e.preventDefault();
    if (this.props.handleLike) {
      this.props.handleLike(this.props.post._id);
    }
    else {
      this.props.toggleLike(this.props.post._id);
    }
  }

  toggleComments = e => {
    e.preventDefault();
    this.setState({ showComments: this.state.showComments ? false : true });
  }

  renderLike = () => {
    const { length } = this.props.post.likedIds;
    if (this.props.post.likedIds.includes(this.props.auth._id)) {
        return (
          <Link target="_blank" to={"/list/" + JSON.stringify(this.props.post.likedIds)}>
            <b>{length + " like" + (length > 1 ? "s" : "")}</b>
          </Link>
        );
    }
    else {
      switch (length) {
        case 0:
          return <a href="" onClick={e => e.preventDefault()}>0 likes</a>;
        default:
          return (
            <Link to={"/list/" + JSON.stringify(this.props.post.likedIds)}>
              {length + " like" + (length > 1 ? "s" : "")}
            </Link>
          );
      }
      return String(this.props.post.likedIds.length) + " like" + (this.props.post.likedIds.length !== 1 ? "s" : "");
    }
  }

  renderLikeIcon = () => {
    if (this.props.post.likedIds.includes(this.props.user._id)) {
      return <i className="material-icons md-12">thumb_up</i>;
    }
    else {
      return <span className="lighter"><i className="material-icons md-12">thumb_up</i></span>;
    }
  }

  renderCommentOption = () => {
    switch (this.props.post.commentIds.length) {
      case 0:
        return this.props.auth ? "add comment" : "0 comments";
      case 1:
        return "show 1 comment";
      default:
        return "show " + this.props.post.commentIds.length + " comments";
    }
  }

  componentDidMount = () => {
    renderCanvas(
      this.props.user.photo || process.env.PUBLIC_URL + "/defaultProfilePhoto.png",
      "image=" + this.props.post._id,
      this.props.user._id
    );
    document.getElementById("content=" + this.props.post._id).innerHTML = this.props.post.contentDisplay;
  }

  componentDidUpdate = () => {
    if (!this.state.edit) {
      document.getElementById("content=" + this.props.post._id).innerHTML = this.props.post.contentDisplay;
    }
  }

  modules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["link"],
    ],
  }

  formats = [
    "bold", "italic", "underline", "strike", "link"
  ]

  render() {
    return (
      <div className="one-post">
        <div className="post-photo">
          <canvas id={"image=" + this.props.post._id}>
          </canvas>
        </div>
        <div className="post-date red-italic">
          {this.props.user.name + ",   " + this.props.postDate}
        </div>
        <div className="post-content">
          {
            this.state.exceedMessage &&
            <div className="post-date red-italic">Maximum length exceeded</div>
          }
          {
            this.state.edit &&
            <div className="ui form">
              <div className="field">
                <ReactQuill
                  theme="snow"
                  modules={this.modules}
                  formats={this.formats}
                  onChange={this.handleChange}
                  value={this.state.htmlContent}
                />
              </div>
            </div>
          }
          {
            !this.state.edit &&
            <div className="post-text">
              <span id={"content=" + this.props.post._id}>
              </span>
              <span className="red-bar">{"n"}</span>
            </div>
          }
          {
            this.props.isUser && !this.state.edit && !this.state.deleteConfirm &&
            <div className="options-grid">
              <a href="" onClick={this.handleEdit}><b>edit</b><i className="material-icons md-12">edit</i></a>
              <a href="" onClick={this.handleDelete}><b>delete</b><i className="material-icons md-12">delete</i></a>
            </div>
          }
          {
            this.state.deleteConfirm &&
            <>
              <span><b>Are you sure you want to delete this post?</b></span>
              <div className="options-grid">
                <a href="" onClick={this.handleCancel}><b>cancel</b><i className="material-icons md-12">cancel</i></a>
                <a href="" onClick={this.handleDeleteConfirm}><b>delete post</b><i className="material-icons md-12">delete</i></a>
              </div>
            </>
          }
          {
            this.state.edit &&
            <div className="post-options">
              <a href="" onClick={e => this.handleSave(e)}><b>save post</b><i className="material-icons md-12">save</i></a>
              <a href="" onClick={e => this.handleCancel(e)}><b>cancel</b><i className="material-icons md-12">cancel</i></a>
            </div>
          }
          <div className="options-grid">
            {
              this.props.auth &&
              <a href="" onClick={e => this.handleLike(e)}>{this.renderLikeIcon()}</a>
            }
            {this.renderLike()}
            {
              !this.props.isComment &&
              <a
                href=""
                onClick={e => this.toggleComments(e)}
              >
                {this.state.showComments ? "hide comments" : this.renderCommentOption()}
              </a>
            }
          </div>
          {
            this.state.showComments &&
            <CommentsDisplay postId={this.props.post._id} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default connect(mapStateToProps, actions)(Post);
