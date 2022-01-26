export const UPDATE_PRODUCT = `mutation UpdateProduct($input: ProductInput, $id: Int!) {
  updateProduct(input: $input, id: $id) {
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