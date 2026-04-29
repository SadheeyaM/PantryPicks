const axios = require("axios");

const userApi = axios.create({
  baseURL: process.env.USER_SERVICE_URL,
  timeout: 5000,
});

exports.createUser = (userData) => {
  return userApi.post("/users", userData);
};

exports.signup = (signupData) => {
  return userApi.post("/users/auth/signup", signupData);
};

exports.login = (loginData) => {
  return userApi.post("/users/auth/login", loginData);
};

exports.getUsers = async () => {
  return userApi.get("/users");
};

exports.getUserById = (id) => {
  return userApi.get(`/users/${id}`);
};

exports.updateUser = (id, userData) => {
  return userApi.patch(`/users/${id}`, userData);
};