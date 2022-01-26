export const UPDATE_BANNER = `mutation UpdateBanner($input: BannerInput, $id: Int!) {
  updateBanner(input: $input, id: $id) {
    id
    page
    title
    positionX
    positionY
    html
  }
}`