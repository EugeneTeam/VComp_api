export const REMOVE_ARTICLE = `mutation RemoveArticle($articleId: ArticleId!) {
  removeArticle(articleId: $articleId) {
    id
    articleCategoryId
    title
    text
    image
    status
    source

  }
}`