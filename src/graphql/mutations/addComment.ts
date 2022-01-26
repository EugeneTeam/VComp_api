export const ADD_COMMENT = `mutation AddComment($input: AddComment) {
  addComment(input: $input) {
    id
    type
    rating
    description
    flaws
    dignity
    userId
    productId
    parentId
  }
}`