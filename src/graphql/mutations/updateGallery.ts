export const UPDATE_GALLERY = `mutation UpdateGallery($input: GalleryInput, $id: Int!) {
  updateGallery(input: $input, id: $id) {
    id
    name
  }
}`