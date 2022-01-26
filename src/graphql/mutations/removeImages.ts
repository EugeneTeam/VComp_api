export const REMOVE_IMAGES = `mutation RemoveImages($input: RemoveImages) {
  removeImages(input: $input) {
    id
    name
    url
    order
  }
}`