export const GET_ARTICLES = `query GetArticles($filter: ArticleFilter, $pagination: Pagination) {
  getArticles(filter: $filter, pagination: $pagination) {
    count
    rows {
      id
      articleCategoryId
      title
      text
      image
      status
      source
    }
  }
}`