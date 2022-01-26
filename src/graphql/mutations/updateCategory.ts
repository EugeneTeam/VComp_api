export const UPDATE_CATEGORY = `mutation UpdateCategory($input: CategoryInput, $id: Int!) {
  updateCategory(input: $input, id: $id) {
    id
    name
    parentId
  }
}`