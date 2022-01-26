export const CREATE_PRODUCT = `mutation CreateProduct($input: ProductInput) {
  createProduct(input: $input) {
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