export const UPDATE_DELIVERY_SERVICE = `mutation UpdateDeliveryService($input: UpdateDeliveryServiceInput) {
  updateDeliveryService(input: $input) {
    id
    name
    isActive
    info
  }
}`