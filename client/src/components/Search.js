import React, { Component } from "react";
import { connect } from "react-redux";

import "./Search.css";
import List from "./List";
import * as actions from "../actions";

class Search extends Component {
  state = {
    showResults: false,
    searchQuery: ""
  }

  handleSubmit = async e => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    await this.props.searchProfiles(this.state.searchQuery);
    document.body.style.cursor = "default";
    this.setState({ showResults: true, searchQuery: ""});
  }
  render() {
    return (
      <>
      <div className="search ui form">
        <label htmlFor="search" ><i className="material-icons md-18">search</i><b> Search users: </b></label>
        <input
          type="test"
          onChange={e => this.setState({ searchQuery: e.target.value, showResults: false})}
          value={this.state.searchQuery}
        />
        <a href="" onClick={this.handleSubmit}><b>Submit</b></a>
      </div>
      {
        this.state.showResults && <List />
      }
      </>
    );
  }
}

export default connect(null, actions)(Search);
