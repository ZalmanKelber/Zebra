import React, { Component } from "react";
import axios from "axios";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";

import * as actions from "../actions";
import findErrors from "../utils/findErrors";
import "./Authenticate.css";
import GoogleAuth from "./GoogleAuth";
import EmailAuth from "./EmailAuth";

class Authenticate extends Component {

  state = {
    redirect: false,
    authenticationError: false,
    passwordMatchError: false,
    missingPasswordError: false,
    invalidEmailError: false,
    email: "",
    password: "",
    passwordConfirm: ""
  }

  handleChange = e => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  setErrorFalse = field => {
    this.setState({
      [field]: false
    });
  }

  checkForErrors = () => {
    const errors = findErrors({
      email: this.state.email,
      password: this.state.password,
      passwordConfirm: this.state.passwordConfirm
    });
    let containsErrors = false;
    if (errors.missingPasswordError) {
      this.setState({ missingPasswordError: true});
      containsErrors = true;
    }
    if (errors.invalidEmailError) {
      this.setState({ invalidEmailError: true});
      containsErrors = true;
    }
    if (errors.passwordMatchError) {
      this.setState({ passwordMatchError: true});
      containsErrors = true;
    }
    return containsErrors;
  }

  handleSubmit = e => {
    console.log("handleSubmit called with this.props.signup = ", this.props.signup);
    e.preventDefault();
    this.setState({
      email: "",
      password: "",
      passwordConfirm: ""
    });
    const containsErrors = this.checkForErrors();
    if (this.props.signup && containsErrors) {
      return;
    }
    const transport = axios.create();
    const params = {
      email: this.state.email,
      password: this.state.password
    }
    const destination = this.props.signup ? "api/signup" : "api/login";
    transport.post(destination, params)
      .catch(err => {
      this.setState({ authenticationError: true});
      })
      .then(response => {
        this.props.fetchUser();
        this.setState({ redirect: response });
      });
  }

  render() {
    const containerHeight = String(window.innerHeight - 40);
    return (
      <div className="authenticate-wrapper" style={{ height: containerHeight + "px" }}>
        {
          this.state.redirect && <Redirect to="/" />
        }
        <div className="authenticate-content">
          <div className="authenticate-title">
             <h1>{this.props.signup ? "Sign up" : "Login"}</h1>
             {this.state.authenticationError && <p className="red" >Error.  Please try again</p>}
          </div>
          <div className="form-container">
            <EmailAuth
              signup={this.props.signup}
              setErrorFalse={this.setErrorFalse}
              handleChange={this.handleChange}
              handleSubmit={this.handleSubmit}
              authenticationError={this.state.authenticationError}
              passwordMatchError={this.state.passwordMatchError}
              missingPasswordError={this.state.missingPasswordError}
              invalidEmailError={this.state.invalidEmailError}
              email={this.state.email}
              password={this.state.password}
              passwordConfirm={this.state.passwordConfirm}
            />
            <GoogleAuth />
          </div>
        </div>
      </div>
    );
  }
}

export default connect(null, actions)(Authenticate);
