export const REMOVE_BANNER = `mutation RemoveBanner($id: Int!) {
  removeBanner(id: $id) {
    id
    page
    title
    positionX
    positionY
    html
  }
}`