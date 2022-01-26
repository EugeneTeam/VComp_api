export const CREATE_CATEGORY = `mutation CreateCategory($input: CategoryInput) {
  createCategory(input: $input) {
    id
    name
    parentId
  }
}`