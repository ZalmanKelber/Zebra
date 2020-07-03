import React, { Component } from "react";
import { BrowserRouter, Route } from "react-router-dom";
import { connect } from "react-redux";

import * as actions from "../actions";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import Search from "./Search";
import List from "./List";

import "./App.css";

class App extends Component {
  componentDidMount() {
    this.props.fetchUser();
  }
  render() {
    return (
      <div className="container">
        <BrowserRouter>
          <div>
            <Header />
            <Route path="/" exact component={Home} />
            <Route path="/login" exact component={Login} />
            <Route path="/signup" exact component={Signup} />
            <Route path="/profile/:id" exact component={Profile} />
            <Route path="/search" exact component={Search} />
            <Route path="/list/:listString" exact component={List} />
          </div>
        </BrowserRouter>
      </div>
    );
  }
}

export default connect(null, actions)(App);
