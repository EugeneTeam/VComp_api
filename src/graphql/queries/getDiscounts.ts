export const GET_DISCOUNTS = `query GetDiscounts($pagination: Pagination) {
  getDiscounts(pagination: $pagination) {
    id
    type
    value
    expiredAt
  }
}`