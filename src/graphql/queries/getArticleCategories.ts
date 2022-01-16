export const GET_ARTICLE_CATEGORIES = `query GetArticleCategories($filter: ArticelCategoryFilter) {
  getArticleCategories(filter: $filter) {
    id
    name
    parentId
  }
}`