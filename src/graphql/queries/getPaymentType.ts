export const GET_PAYMENT_TYPE = `query GetPaymentType($id: Int!) {
  getPaymentType(id: $id) {
    id
    name
    isActive
    info
  }
}`