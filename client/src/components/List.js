import React, { Component } from "react";
import { connect } from "react-redux";

import "./List.css";
import ProfileDisplay from "./ProfileDisplay";
import * as actions from "../actions";

class List extends Component {
  componentDidMount = async () => {
    if (this.props.match) {
      document.body.style.cursor = "wait";
      await this.props.fetchListOfProfiles(JSON.parse(this.props.match.params.listString));
      document.body.style.cursor = "default";
    }
  }

  renderList = () => {
    if (this.props.list.length > 0) {
      return (
        <>
        {
          !this.props.list &&
          <div className="one-profile-display">
            <div className="profile-name-display">no results</div>
          </div>
        }
        {
          this.props.list.map(user => {
            return (
              <ProfileDisplay
                key={user._id}
                user={user}
              />
            )
          })
        }
        </>
      );
    }
  }

  render() {
    return (
      <>
      <div className="list-container">
        <div className="list">{this.renderList()}</div>
      </div>
      </>
    );
  }
}

const mapStateToProps = ({ list }) => {
  return { list };
};

export default connect(mapStateToProps, actions)(List);
