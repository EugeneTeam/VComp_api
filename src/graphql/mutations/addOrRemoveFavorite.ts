export const ADD_OR_REMOVE_FAVORITE = `mutation AddOrRemoveFavorite($input: FavoriteIpnut!) {
  addOrRemoveFavorite(input: $input) {
    id
    productId
    userId
  }
}`