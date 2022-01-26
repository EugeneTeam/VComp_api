export const UPDATE_ARTICLE_CATEGORY = `mutation UpdateArticleCategory($input: ArticleCategoryInput!, $id: Int!) {
  updateArticleCategory(input: $input, id: $id) {
    id
    name
    parentId
  }
}`