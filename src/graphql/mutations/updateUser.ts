export const UPDATE_USER = `mutation UpdateUser($input: UpdateUserInput) {
  updateUser(input: $input) {
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