export const CREATE_DELIVERY_SERVICE = `mutation CreateDeliveryService($input: CreateDeliveryServiceInput) {
  createDeliveryService(input: $input) {
    id
    name
    isActive
    info
  }
}`