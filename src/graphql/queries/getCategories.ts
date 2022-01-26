export const GET_CATEGORIES = `query GetCategories($pagination: Pagination) {
  getCategories(pagination: $pagination) {
    count
    rows {
      id
      name
      parentId
    }
  }
}`