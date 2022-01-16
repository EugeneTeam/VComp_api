export const GET_USER = `query GetUser($id: Int!) {
  getUser(id: $id) {
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