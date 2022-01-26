export const REMOVE_GALLERY = `mutation RemoveGallery($id: Int!) {
  removeGallery(id: $id) {
    id
    name
  }
}`