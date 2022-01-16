export const LOG_IN = `query LogIn($input: LogInInput) {
  logIn(input: $input) {
    token
  }
}`