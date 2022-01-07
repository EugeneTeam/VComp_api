export const CREATE_USER = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
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