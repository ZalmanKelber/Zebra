import React from "react";

const EmailAuth = props => {
  return (
    <div className="email-signup">
      <div className="ui form">
        <div className="form-row form-row-custom">
          <span className="button-row-label" >Enter email:</span>
          <br />
          <input
            onChange={props.handleChange}
            onClick={() => props.setErrorFalse("invalidEmailError")}
            type="email"
            name="email"
            value={props.email}
            autoComplete="off"
          />
          {
            props.invalidEmailError &&
            <div className="red">
              invalid email
            </div>
          }
        </div>
        <div className="form-row form-row-custom">
          <span className="button-row-label" >Enter password:</span>
          <br />
          <input
            onChange={props.handleChange}
            onClick={() => props.setErrorFalse("missingPasswordError")}
            type="password"
            name="password"
            value={props.password}
            autoComplete="off"
          />
          {
            props.missingPasswordError &&
            <div className="red">
              enter password
            </div>
          }
        </div>
        {
        props.signup &&
        <div className="form-row form-row-custom">
          <span className="button-row-label" >Confirm password:</span>
          <br />
          <input
            onChange={props.handleChange}
            onClick={() => props.setErrorFalse("passwordMatchError")}
            type="password"
            name="passwordConfirm"
            value={props.passwordConfirm}
            autoComplete="off"
          />
          {
            props.passwordMatchError &&
            <div className="red">
              passwords do not match
            </div>
          }
        </div>
        }
        <button onClick={props.handleSubmit} className="ui button primary fluid">
          Submit
        </button>
      </div>
    </div>
  );
}

export default EmailAuth;
