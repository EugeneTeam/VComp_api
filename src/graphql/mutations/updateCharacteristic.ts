export const UPDATE_CHARACTERISTIC = `mutation UpdateCharacteristic($input: CharacteristicInput, $id: Int!) {
  updateCharacteristic(input: $input, id: $id) {
    id
    name
    value
    categoryId
  }
}`