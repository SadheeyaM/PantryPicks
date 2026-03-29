const axios = require("axios");

const productApi = axios.create({
  baseURL: process.env.PRODUCT_SERVICE_URL,
  timeout: 5000,
});

exports.getProducts = async () => {
  return productApi.get("/products") ;
}

exports.getProductById = (id) => {
  return productApi.get(`/products/${id}`) ;
};

exports.createProduct = (productData) => {
  return productApi.post("/products", productData) ;
}

exports.updateProduct = (id, productData) => {
  return productApi.put(`/products/${id}`, productData) ;
}