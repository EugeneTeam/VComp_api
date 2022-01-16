export const REMOVE_DELIVERY_SERVICE = `mutation RemoveDeliveryService($id: Int!) {
  removeDeliveryService(id: $id) {
    id
    name
    isActive
    info
  }
}`