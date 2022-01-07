export const GET_PAYMENT_TYPES = `query GetPaymentTypes($limit: Int, $offset: Int) {
  getPaymentTypes(limit: $limit, offset: $offset) {
    id
    name
    isActive
    info
  }
}`