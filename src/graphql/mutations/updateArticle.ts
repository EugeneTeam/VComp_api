export const UPDATE_ARTICLE = `mutation UpdateArticle($input: ArticelInput!, $articleId: ArticleId!) {
  updateArticle(input: $input, articleId: $articleId) {
    id
    articleCategoryId
    title
    text
    image
    status
    source

  }
}`