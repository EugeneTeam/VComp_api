export const CREATE_ARTICLE = `mutation CreateArticle($input: ArticelInput!) {
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