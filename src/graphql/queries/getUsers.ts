export const GET_USERS = `query GetUsers($filter: UserInputFilter) {
  getUsers(filter: $filter) {
    count
    rows {
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