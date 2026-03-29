const axios = require("axios");

const userApi = axios.create({
  baseURL: process.env.SERVICE_URL,
  timeout: 5000,
}) ;

exports.getUsers = async () => {
  return userApi.get("/users") ;
}  

exports.getUserById = (id) => {
  return userApi.get(`/users/${id}`) ;
}

exports.updateUser = (id, userData) => {
  return userApi.put(`/users/${id}`, userData) ;
}