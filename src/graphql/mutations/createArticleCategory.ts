export const CREATE_ARTICLE_CATEGORY = `mutation CreateArticleCategory($input: ArticelCategoryInput!) {
  createArticleCategory(input: $input) {
    id
    name
    parentId
  }
}`