export const UPDATE_ARTICLE = `mutation UpdateArticle($input: ArticleInput!, $id: Int!) {
  updateArticle(input: $input, id: $id) {
    id
    articleCategoryId
    title
    text
    image
    status
    source
  }
}`