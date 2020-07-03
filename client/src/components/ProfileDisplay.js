import React, { Component } from "react";
import { connect } from "react-redux";

import { renderCanvas } from "../utils/renderCanvas";

class ProfileDisplay extends Component {
  componentDidMount = () => {
    renderCanvas(this.props.user.photo, "list" + this.props.user._id, this.props.user._id);
  }

  openProfile = e => {
    e.preventDefault();
    window.open("/profile/" + this.props.user._id);
  }

  renderFollowing = () => {
    if (this.props.auth) {
      if (this.props.user.followers.includes(String(this.props.auth._id))) {
        return (
          <>
            <br />
            <a style={{color: "red", fontSize: "0.8rem"}} href="" onClick={e => e.preventDefault()}><em>following</em></a>
          </>
        );
      }
    }
  }

  render () {
    return (
      <div className="one-profile-display">
        <div className="one-profile-display-canvas">
          <canvas id={"list" + this.props.user._id}></canvas>
        </div>
        <div className="profile-name-display">
          <a href="" onClick={this.openProfile}>{this.props.user.name}</a>
          {this.renderFollowing()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth }
}

export default connect(mapStateToProps)(ProfileDisplay);
