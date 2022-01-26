export const UPDATE_IMAGE = `mutation UpdateImage($input: AddImages, $id: Int!) {
  updateImage(input: $input, id: $id) {
    id
    name
    url
    order
  }
}`