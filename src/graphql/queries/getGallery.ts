export const GET_GALLERY = `query GetGallery($id: Int!) {
  getGallery(id: $id) {
    id
    name
  }
}`