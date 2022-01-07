export const CREATE_PAYMENT_TYPE = `mutation CreatePaymentType($input: PaymentTypeInput) {
  createPaymentType(input: $input) {
    id
    name
    isActive
    info
  }
}`