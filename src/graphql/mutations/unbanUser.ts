export const UNBAN_USER = `mutation UnbanUser($input: UnbanUserInput) {
  unbanUser(input: $input) {
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