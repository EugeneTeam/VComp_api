export const GET_PRODUCT = `query GetProduct($id: Int!) {
  getProduct(id: $id) {
    id
    name
    description
    price
    discountId
    categoryId
    galleryId
    createdAt
    updatedAt
  }
}`