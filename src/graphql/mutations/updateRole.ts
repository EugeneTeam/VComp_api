export const UPDATE_ROLE = `mutation UpdateRole($id: Int!, $name: String!) {
  updateRole(id: $id, name: $name) {
    id
    name
  }
}`