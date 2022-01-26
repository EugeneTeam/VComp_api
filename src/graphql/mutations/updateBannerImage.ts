export const UPDATE_BANNER_IMAGE = `mutation UpdateBannerImage($input: AddImageBanner, $id: Int!) {
  updateBannerImage(input: $input, id: $id) {
    id
    bannerId
    imageUrl
    title
    productUrl
  }
}`