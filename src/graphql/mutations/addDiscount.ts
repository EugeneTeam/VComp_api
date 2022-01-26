export const ADD_DISCOUNT = `mutation AddDiscount($input: DiscountInput) {
  addDiscount(input: $input) {
    id
    type
    value
    expiredAt
  }
}`