export const REMOVE_COMMENT = `mutation RemoveComment($id: Int!) {
  removeComment(id: $id) {
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