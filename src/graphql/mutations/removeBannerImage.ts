export const REMOVE_BANNER_IMAGE = `mutation RemoveBannerImage($id: Int!) {
  removeBannerImage(id: $id) {
    id
    bannerId
    imageUrl
    title
    productUrl
  }
}`