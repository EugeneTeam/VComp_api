export const GET_COMMENT = `query GetComment($id: Int!) {
  getComment(id: $id) {
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