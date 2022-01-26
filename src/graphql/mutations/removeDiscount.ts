export const REMOVE_DISCOUNT = `mutation RemoveDiscount($id: Int!) {
  removeDiscount(id: $id) {
    id
    type
    value
    expiredAt
  }
}`