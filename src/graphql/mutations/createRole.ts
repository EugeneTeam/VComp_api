export const CREATE_ROLE = `mutation CreateRole($name: String!) {
  createRole(name: $name) {
    id
    name
  }
}`