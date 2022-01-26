export const CREATE_BANNER = `mutation CreateBanner($input: BannerInput) {
  createBanner(input: $input) {
    id
    page
    title
    positionX
    positionY
    html
  }
}`