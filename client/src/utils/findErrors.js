const findErrors = signupInfo => {
  const errors = {
    missingPasswordError: false,
    passwordMatchError: false,
    invalidEmailError: false
  };
  if (!signupInfo.password) {
    errors.missingPasswordError = true;
  }
  else if (signupInfo.password !== signupInfo.passwordConfirm) {
    errors.passwordMatchError = true;
  }
  if (!/^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(signupInfo.email)) {
    errors.invalidEmailError = true;
  }
  return errors;
}

export default findErrors;
