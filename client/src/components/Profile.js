import React, { Component } from "react";
import { connect } from "react-redux";

import * as actions from "../actions";
import UserInfoDisplay from "./UserInfoDisplay";
import PostsDisplay from "./PostsDisplay";
import "./Profile.css";

class Profile extends Component {
  state = {
    isUser: null,
    user: null
  }

  componentDidMount = async () => {
    await this.props.fetchUser();
    if (!this.props.auth || this.props.match.params.id !== this.props.auth._id) {
      await this.props.fetchProfile(this.props.match.params.id);
      if (this.props.viewed) {
        this.setState({
          isUser: false,
          user: this.props.viewed
        });
      }
    }
    else {
      this.setState({
        isUser: true,
        user: this.props.auth
      });
    }
  }

  componentWillUnmount = () => {
    this.setState({ isUser: null });
  }

  renderProfile = user => {
    if (user) {
      return (
        <div className="profile-container">
          <div className="user-info-display-container">
            <UserInfoDisplay
              isUser={this.state.isUser}
              profileId={this.props.match.params.id}
              user={this.state.user}
            />
          </div>
          <div className="posts-display-container">
            <PostsDisplay
              isUser={this.state.isUser}
              profileId={this.props.match.params.id}
              user={this.state.user}
            />
          </div>
        </div>
      );
    }
  }

  render() {
    return (
      <>
        {this.renderProfile(this.state.user)}
      </>
    );
  }
}

const mapStateToProps = ({ auth, viewed, list }) => {
  return { auth, viewed, list };
}

export default connect(mapStateToProps, actions)(Profile);
