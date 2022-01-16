export const GET_DELIVERY_SERVICE = `query GetDeliveryService($id: Int!) {
  getDeliveryService(id: $id) {
    id
    name
    isActive
    info
  }
}`