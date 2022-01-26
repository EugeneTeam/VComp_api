export const REMOVE_PRODUCT = `mutation RemoveProduct($id: Int!) {
  removeProduct(id: $id) {
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