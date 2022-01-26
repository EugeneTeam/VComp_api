export const REMOVE_CATEGORY = `mutation RemoveCategory($id: Int!) {
  removeCategory(id: $id) {
    id
    name
    parentId
  }
}`