import React, { Component } from "react";
import { connect } from "react-redux"
import axios from "axios";

import Post from "./Post";
import formatDate from "../utils/formatDate";
import "./Profile.css";

class Feed extends Component {
  state = {
    displayedPosts: [],
    notDisplayedPosts: [],
    users: []
  }

  componentDidMount = async () => {
    const users = [this.props.auth._id, ...this.props.auth.following];
    document.body.style.cursor = "wait";
    const userList = await Promise.all(users.map(async userId => {
      const res = await axios.get("/user/get/" + userId);
      return res.data;
    }));
    const postsByUser = await Promise.all(users.map(async userId => {
      const res = await axios.get("/posts/" + userId);
      return res.data;
    }));
    const posts = [].concat(...postsByUser).sort((a, b) => a.datePublished < b.datePublished ? 1 : -1);
    document.body.style.cursor = "default";
    this.setState({
      notDisplayedPosts: posts.slice(15),
      displayedPosts: posts.slice(0, 15),
      users: userList
    });
  }

  findUser = id => {
    const foundUser = this.state.users.filter(user => String(id) === String(user._id))[0];
    return foundUser;
  }

  displayNext = e => {
    e.preventDefault();
    this.setState({
      displayedPosts: this.state.displayedPosts.concat(this.state.notDisplayedPosts.slice(0, 15)),
      notDisplayedPosts: this.state.notDisplayedPosts.slice(15)
    });
  }

  handleLike = async postId => {
    const res = await axios.patch("posts/toggle_like/" + postId);
    this.setState({
      displayedPosts: this.state.displayedPosts.map(post => {
        if (String(post._id) === String(postId)) {
          return res.data;
        }
        else {
          return post;
        }
      })
    });
  }

  renderNoPostsMessage = () => {
    console.log("renderNoPostsMessage called");
    console.log(this.state.displayedPosts.length, this.state.notDisplayedPosts.length);
    if (this.state.displayedPosts.length === 0 && this.state.notDisplayedPosts.length === 0) {
      return (
        <div className="one-post">
          <div className="post-content">No posts to display.  Head to your profile to
          create your own posts or search to find other users to follow</div>
        </div>
      )
    }
  }

  render() {
    return (
      <div className="profile-container">
          <div className="posts-display-container">
            <div className="posts-display">
            {
              this.renderNoPostsMessage()
            }
            {
              this.state.displayedPosts.map(post => {
                return (
                  <Post
                    key={post._id}
                    post={post}
                    isUser={String(post._user) === String(this.props.auth._id)}
                    postDate={formatDate(new Date(post.datePublished))}
                    user={this.findUser(post._user)}
                    handleLike={this.handleLike}
                  />
                );
              })
            }
            {
              this.state.notDisplayedPosts.length > 0 &&
              <div className="load-posts">
                <a href="" onClick={this.displayNext}><b>DISPLAY MORE POSTS</b></a>
              </div>
            }
            </div>
          </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default connect(mapStateToProps)(Feed);
