export const BAN_USER = `mutation BanUser($input: BanUserInput, $some: [String]!) {
  banUser(input: $input, some: $some) {
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