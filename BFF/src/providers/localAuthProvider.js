const userClient = require("../clients/user");

const unwrapUserPayload = (response) => {
  const payload = response?.data?.data ?? response?.data;
  if (payload && payload.data) {
    return payload.data;
  }
  return payload;
};

const normalizeEmail = (payload) => payload.userEmail || payload.email;

const signup = async (payload) => {
  const response = await userClient.signup({
    ...payload,
    userEmail: normalizeEmail(payload),
  });
  return unwrapUserPayload(response);
};

const login = async (payload) => {
  const response = await userClient.login({
    userEmail: normalizeEmail(payload),
    password: payload.password,
  });
  return unwrapUserPayload(response);
};

module.exports = {
  signup,
  login,
};