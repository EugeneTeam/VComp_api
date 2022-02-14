export const REMOVE_IMAGES = `mutation RemoveImages($input: RemoveImages) {
  removeImages(input: $input) {
    type
    id
  }
}`