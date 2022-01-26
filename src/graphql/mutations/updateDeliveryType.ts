export const UPDATE_DELIVERY_TYPE = `mutation UpdateDeliveryType($input: CreateDeliveryTypeInput, $id: Int!) {
  updateDeliveryType(input: $input, id: $id) {
    id
    name
    isActive
    info
  }
}`