export const REMOVE_DELIVERY_TYPE = `mutation RemoveDeliveryType($id: Int!) {
  removeDeliveryType(id: $id) {
    id
    name
    isActive
    info
  }
}`