export const CREATE_GALLERY = `mutation CreateGallery($input: GalleryInput) {
  createGallery(input: $input) {
    id
    name
  }
}`