export const GET_DISCOUNT = `query GetDiscount($id: Int!) {
  getDiscount(id: $id) {
    id
    type
    value
    expiredAt
  }
}`