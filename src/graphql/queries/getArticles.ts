export const GET_ARTICLES = `query GetArticles($filter: ArticleFilter) {
  getArticles(filter: $filter) {
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