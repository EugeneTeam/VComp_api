export const CREATE_ARTICLE_CATEGORY = `mutation CreateArticleCategory($input: ArticleCategoryInput!) {
  createArticleCategory(input: $input) {
    id
    name
    parentId
  }
}`