import React, { Component } from "react";

class Landing extends Component {
  render() {
    return (
      <div className="must-verify">
        <h1>Welcome to Zebra!</h1>
        <img src={process.env.PUBLIC_URL + "/ZebraLogo.png"} alt="zebra-logo"/>
        <h2>...What's black, white and read all over?</h2>
        <h3>Zebra is a microblogging platform rendered in a unique
        three-color design built with custom CSS for fans of Wikipedia</h3>
        <br />
        <h3>How it works: when you compose a new post and save it,
        your comment will be displayed with each individual word serving as a hyperlink
        to a Wikipedia article.  If you want more than one word to be rendered as a single combined
        link, simply enclose those words in backticks, `like this` (be sure not to change the italics
        or font-weight in between backticks or in the middle of words).  You can also upload a photo
        for your profile, which will be displayed in our custom three-color filter</h3>
        <h2>Get started:</h2>
        <h3><a href="/signup">signup</a> or <a href="/login">log in</a></h3>
      </div>
    )
  }
}

export default Landing;
