export const GET_ARTICLE = `query GetArticle($id: Int!) {
  getArticle(id: $id) {
    id
    articleCategoryId
    title
    text
    image
    status
    source
  }
}`