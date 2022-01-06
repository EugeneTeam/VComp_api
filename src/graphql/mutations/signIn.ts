export const SIGN_IN = `mutation SignIn($input: SignInInput) {
  signIn(input: $input) {
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
}`