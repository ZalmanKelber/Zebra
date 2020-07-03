import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";
import AddPost from "./AddPost";
import Post from "./Post";
import formatDate from "../utils/formatDate";

class PostsDisplay extends Component {
  componentDidMount = () => {
    this.props.fetchPosts(this.props.profileId);
  }

  render() {
    return (
      <div className="posts-display">
        {
          this.props.isUser &&
          <AddPost profileId={this.props.profileId} />
        }
        {
          this.props.posts.map(post => {
            return (
              <Post
                key={post._id}
                post={post}
                isUser={this.props.isUser}
                postDate={formatDate(new Date(post.datePublished))}
                user={this.props.user}
              />
            );
          })
        }
      </div>
    )
  }
}

const mapStateToProps = ({ posts, auth, viewed }) => {
  return { posts, auth, viewed };
}

export default connect(mapStateToProps, actions)(PostsDisplay);
