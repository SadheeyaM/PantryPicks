const axios = require("axios") ;

const categoryApi = axios.create({
  baseURL: process.env.CATEGORY_SERVICE_URL,
  timeout: 5000,
}) ;

exports.getCategories = async () => {
  return categoryApi.get("/category") ;
}

exports.getCategoryById = (id) => {
  return categoryApi.get(`/category/${id}`) ;
}

exports.createCategory = (categoryData) => {
  return categoryApi.post("/category", categoryData);
}

exports.updateCategory = (id, categoryData) => {
  return categoryApi.patch(`/category/${id}`, categoryData) ;
}
