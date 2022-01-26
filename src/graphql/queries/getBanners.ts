export const GET_BANNERS = `query GetBanners($pagination: Pagination) {
  getBanners(pagination: $pagination) {
    count
    rows {
      id
      page
      title
      positionX
      positionY
      html
    }
  }
}`