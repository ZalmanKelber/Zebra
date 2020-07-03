import React, { Component } from "react";
import axios from "axios";

class MustVerify extends Component {
  state = {
    emailSent: false
  }

  sendEmail = async e => {
    e.preventDefault();
    document.body.style.cursor = "wait";
    await axios.post("/api/resend");
    document.body.style.cursor = "default";
    this.setState({ emailSent: true });
  }
  render() {
    return (
      <div className="must-verify">
        <h1>You must verify your account to continue</h1>
        <h2>Click the following link to send another email, and be sure to check your spam folder</h2>
        <a href="" onClick={this.sendEmail}>resend</a>
        {
          this.state.emailSent &&
          <h2>An email was just sent.  Check your mail and click the link to verify your account</h2>
        }
      </div>
    )
  }
}

export default MustVerify;
