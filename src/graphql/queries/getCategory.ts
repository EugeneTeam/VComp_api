export const GET_CATEGORY = `query GetCategory($id: Int!) {
  getCategory(id: $id) {
    id
    name
    parentId
  }
}`