export const GET_BANNER_IMAGE = `query GetBannerImage($id: Int!) {
  getBannerImage(id: $id) {
    id
    bannerId
    imageUrl
    title
    productUrl
  }
}`