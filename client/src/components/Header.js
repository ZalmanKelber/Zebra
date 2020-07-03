import React, { Component } from "react";
import { connect } from "react-redux";

import HeaderLink from "./HeaderLink";
import "./Header.css";

class Header extends Component {
  renderLinks() {
    switch (this.props.auth) {
      case null:
        return;
      case false:
        return (
          <div className="header-links">
            <HeaderLink key="0" name="Search" route="/search" />
            <HeaderLink key="1" name="Home" route="/" />
            <HeaderLink key="2" name="Login" route="/login" />
            <HeaderLink key="3" name="Sign up" route="/signup" />
          </div>
        );
      default:
        return (
          <div className="header-links">
            <HeaderLink key="4" name="Search" route="/search" />
            <HeaderLink key="5" name="Home" route="/" />
            <HeaderLink key="6" name="Profile" route={"/profile/" + this.props.auth._id} />
            <a href="/api/logout">Logout</a>
          </div>
        );
    }
  }

  render(){
    return (
      <div className="header-container">
        <div className="header">
          <div className="logo">
            <div className="logo-image">
              <img src={process.env.PUBLIC_URL + "/ZebraLogo.png"} alt="zebra-logo"/>
            </div>
            <div className="logo-text">
              Zebra
            </div>
          </div>
          {this.renderLinks()}
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({auth}) => {
  return {auth};
}

export default connect(mapStateToProps)(Header);
