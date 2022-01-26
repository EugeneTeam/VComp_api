export const GET_BANNER_IMAGES = `query GetBannerImages($pagination: Pagination) {
  getBannerImages(pagination: $pagination) {
    count
    rows {
      id
      bannerId
      imageUrl
      title
      productUrl
    }
  }
}`