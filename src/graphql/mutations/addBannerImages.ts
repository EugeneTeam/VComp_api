export const ADD_BANNER_IMAGES = `mutation AddBannerImages($input: [AddImageBanner]) {
  addBannerImages(input: $input) {
    id
    bannerId
    imageUrl
    title
    productUrl
  }
}`