export const GET_ROLES = `query GetRoles($limit: Int, $offset: Int) {
  getRoles(limit: $limit, offset: $offset) {
    id
    name
  }
}`