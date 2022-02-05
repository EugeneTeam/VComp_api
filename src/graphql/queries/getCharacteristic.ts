export const GET_CHARACTERISTIC = `query GetCharacteristic($id: Int!) {
  getCharacteristic(id: $id) {
    id
    name
    value
    categoryId
    url
  }
}`