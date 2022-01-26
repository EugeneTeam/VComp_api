export const GET_BANNER = `query GetBanner($id: Int!) {
  getBanner(id: $id) {
    id
    page
    title
    positionX
    positionY
    html
  }
}`