export const LOG_IN = `query LogIn($input: LogInInput) {
  logIn(input: $input) {
    token
    asd {
      id
      fullName
      phone
      city
      email
      status
      banReason
      activationToken
      passwordHash
      resetPasswordToken
      googleId
      roleId
    }
  }
}`