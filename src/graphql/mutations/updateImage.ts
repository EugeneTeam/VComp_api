export const UPDATE_IMAGE = `mutation UpdateImage($input: ImageInput!, $id: Int!) {
  updateImage(input: $input, id: $id) {
    id
    name
    url
    order
  }
}`