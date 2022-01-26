export const GET_CHARACTERISTICS = `query GetCharacteristics($pagination: Pagination) {
  getCharacteristics(pagination: $pagination) {
    count
    rows {
      id
      name
      value
      categoryId
    }
  }
}`