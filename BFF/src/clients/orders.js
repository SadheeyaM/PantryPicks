const axios = require("axios") ;
const e = require("cors") ;

const userApi = axios.create({
  baseURL: process.env.ORDER_SERVICE_URL,
  timeout: 5000,
}) ; 


exports.createOrder = (orderData) => {
  return userApi.post("/orders", orderData) ;
}  

exports.getOrders = async () => {
  return userApi.get("/orders") ;
}   

exports.getOrdersByCustomerId = (customerId) => {
  return userApi.get(`/orders/customer/${customerId}`) ;
}

exports.getOrderById = (id) => {
  return userApi.get(`/orders/${id}`) ;
}  

exports.updateOrder = (id, orderData) => {
  return userApi.put(`/orders/${id}`, orderData) ;
}

