export const ADD_IMAGES = `mutation AddImages($input: AddImages) {
  addImages(input: $input) {
    id
    name
    url
    order
  }
}`