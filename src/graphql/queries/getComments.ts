export const GET_COMMENTS = `query GetComments($pagination: Pagination, $filter: CommentFilter) {
  getComments(pagination: $pagination, filter: $filter) {
    count
    rows {
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
  }
}`