export const GET_IMAGE = `query GetImage($id: Int!) {
  getImage(id: $id) {
    id
    name
    url
    order
  }
}`