export const REMOVE_ARTICLE_CATEGORY = `mutation RemoveArticleCategory($id: Int!) {
  removeArticleCategory(id: $id) {
    id
    name
    parentId
  }
}`