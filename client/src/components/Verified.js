import React, { Component } from "react";

class Verified extends Component {
  render() {
    return (
      <div className="must-verify">
        <h1>Thank you for verifying your account!</h1>
        <h2>If you're not currently logged in you can do so by navigating to the login page on the
        navigation bar above.  Otherwise, head to your profile to edit your user info and create your first post!</h2>
      </div>
    )
  }
}

export default Verified;
