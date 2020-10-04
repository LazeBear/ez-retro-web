export function validPassword(str) {
  return new RegExp(/^[a-zA-Z0-9*.!@#$%^&(){}[\]:;<>,.?/~_+-=|\\]{6,18}$/).test(
    str.trim()
  );
}

export function validEmail(str) {
  return /.+@.+\..+/.test(str.trim());
}
