export const GET_ARTICLE_CATEGORY = `query GetArticleCategory($id: Int!) {
  getArticleCategory(id: $id) {
    id
    name
    parentId
  }
}`