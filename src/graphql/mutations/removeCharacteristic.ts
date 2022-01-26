export const REMOVE_CHARACTERISTIC = `mutation RemoveCharacteristic($id: Int!) {
  removeCharacteristic(id: $id) {
    id
    name
    value
    categoryId
  }
}`