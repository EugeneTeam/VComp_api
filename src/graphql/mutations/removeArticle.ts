export const REMOVE_ARTICLE = `mutation RemoveArticle($id: Int!) {
  removeArticle(id: $id) {
    id
    articleCategoryId
    title
    text
    image
    status
    source
  }
}`