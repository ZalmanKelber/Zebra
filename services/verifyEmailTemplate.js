const keys = require("../config/keys");

module.exports = code => {
  return `
    <div>Thanks for signing up with Zebra!
    <br>
    Click on the link below to verify your account:</div>
    <a href="${keys.redirectDomain}/api/verify/${code}">Verify</a>
  `
}
