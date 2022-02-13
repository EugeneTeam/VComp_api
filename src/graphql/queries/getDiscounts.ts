export const GET_DISCOUNTS = `query GetDiscounts($pagination: Pagination) {
  getDiscounts(pagination: $pagination) {
    count
    rows {
      id
      type
      value
      expiredAt
    }
  }
}`