export const GET_ARTICLE_CATEGORIES = `query GetArticleCategories($filter: ArticleCategoryFilter, $pagination: Pagination) {
  getArticleCategories(filter: $filter, pagination: $pagination) {
    count
    rows {
      id
      name
      parentId
    }
  }
}`