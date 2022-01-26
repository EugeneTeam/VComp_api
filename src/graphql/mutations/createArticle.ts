export const CREATE_ARTICLE = `mutation CreateArticle($input: ArticleInput!) {
  createArticle(input: $input) {
    id
    articleCategoryId
    title
    text
    image
    status
    source
  }
}`