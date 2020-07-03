import React from "react";

const GoogleAuth = () => {
  return (
    <div className="google-signup">
      <div>or:</div>
      <br />
      <div>sign in with google</div>
      <hr />
      <button className="ui button red fluid">
        <a href="/auth/google"><i className="material-icons md-18"></i>Sign in with Google</a>
      </button>
    </div>
  );
}

export default GoogleAuth;
