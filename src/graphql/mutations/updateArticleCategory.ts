export const UPDATE_ARTICLE_CATEGORY = `mutation UpdateArticleCategory($input: ArticelCategoryInput!, $id: Int!) {
  updateArticleCategory(input: $input, id: $id) {
    id
    name
    parentId
  }
}`