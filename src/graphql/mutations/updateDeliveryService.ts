export const UPDATE_DELIVERY_SERVICE = `mutation UpdateDeliveryService($input: UpdateDeliveryServiceInput, $id: Int!) {
  updateDeliveryService(input: $input, id: $id) {
    id
    name
    isActive
    info
  }
}`