export const GET_PRODUCTS = `query GetProducts($pagination: Pagination, $filter: ProductFilter) {
  getProducts(pagination: $pagination, filter: $filter) {
    count
    rows {
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
  }
}`