export const GET_GALLERIES = `query GetGalleries($pagination: Pagination, $filter: GalleryFilter) {
  getGalleries(pagination: $pagination, filter: $filter) {
    count
    rows {
      id
      name
    }
  }
}`