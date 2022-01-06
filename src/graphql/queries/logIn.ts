export const LOG_IN = `query LogIn($email: String!, $password: String!, $rememberMe: Boolean = false) {
  logIn(email: $email, password: $password, rememberMe: $rememberMe) {
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