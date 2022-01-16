export const UPDATE_PAYMENT_TYPE = `mutation UpdatePaymentType($input: PaymentTypeInput!, $id: Int!) {
  updatePaymentType(input: $input, id: $id) {
    id
    name
    isActive
    info
  }
}`