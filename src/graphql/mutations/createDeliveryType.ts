export const CREATE_DELIVERY_TYPE = `mutation CreateDeliveryType($input: CreateDeliveryTypeInput) {
  createDeliveryType(input: $input) {
    id
    name
    isActive
    info
  }
}`