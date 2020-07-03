import React, { Component } from "react";
import { connect } from "react-redux";

import Landing from "./Landing";
import MustVerify from "./MustVerify";
import Feed from "./Feed";

class Home extends Component {
  renderVerify = () => {
    if (this.props.auth && !this.props.auth.verified) {
      return <MustVerify />
    }
  }

  renderFeed = () => {
    if (this.props.auth && this.props.auth.verified) {
      return <Feed />
    }
  }

  render() {
    return (
      <>
      {
        !this.props.auth &&
        <Landing />
      }
      {
        this.renderVerify()
      }
      {
        this.renderFeed()
      }
      </>
    );
  }
}

const mapStateToProps = ({ auth }) => {
  return { auth };
}

export default connect(mapStateToProps)(Home);
