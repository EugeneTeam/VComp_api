export const BAN_USER = `mutation BanUser($input: BanUserInput) {
  banUser(input: $input) {
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