const axios = require("axios");

const cartApi = axios.create({
  baseURL: process.env.CART_SERVICE_URL,
  timeout: 5000,
});

exports.createCart = (cartData) => {
  return cartApi.post("/carts", cartData);
};

exports.getCartById = (cartId) => {
  return cartApi.get(`/carts/${cartId}`);
};

exports.getAllCarts = () => {
  return cartApi.get("/carts");
};

exports.addItemToCart = (cartId, itemData) => {
  return cartApi.post(`/carts/${cartId}/items`, itemData);
};

exports.removeItemFromCart = (cartId, cartItemId) => {
  return cartApi.delete(`/carts/${cartId}/items/${cartItemId}`);
};

exports.updateCartItem = (cartId, cartItemId, itemData) => {
  return cartApi.patch(`/carts/${cartId}/items/${cartItemId}`, itemData);
};