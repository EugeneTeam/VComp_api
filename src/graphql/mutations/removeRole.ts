export const REMOVE_ROLE = `mutation RemoveRole($id: Int!) {
  removeRole(id: $id) {
    id
    name

  }
}`