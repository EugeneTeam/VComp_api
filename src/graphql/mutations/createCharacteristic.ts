export const CREATE_CHARACTERISTIC = `mutation CreateCharacteristic($input: CharacteristicInput) {
  createCharacteristic(input: $input) {
    id
    name
    value
    categoryId
    url
  }
}`