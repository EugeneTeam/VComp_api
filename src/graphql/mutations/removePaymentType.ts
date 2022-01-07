export const REMOVE_PAYMENT_TYPE = `mutation RemovePaymentType($id: Int!) {
  removePaymentType(id: $id) {
    id
    name
    isActive
    info
  }
}`