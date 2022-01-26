export const UPDATE_DISCOUNT = `mutation UpdateDiscount($input: DiscountInput, $id: Int!) {
  updateDiscount(input: $input, id: $id) {
    id
    type
    value
    expiredAt
  }
}`