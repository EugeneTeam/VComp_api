export const GET_DELIVERY_TYPE = `query GetDeliveryType($id: Int!) {
  getDeliveryType(id: $id) {
    id
    name
    isActive
    info
  }
}`