const localAuthProvider = require("../providers/localAuthProvider");
const cognitoAuthProvider = require("../providers/cognitoAuthProvider");

const AUTH_PROVIDER = (process.env.AUTH_PROVIDER || "local").trim().toLowerCase();

const providers = {
  local: localAuthProvider,
  cognito: cognitoAuthProvider,
};

const provider = providers[AUTH_PROVIDER] || localAuthProvider;

module.exports = {
  AUTH_PROVIDER,
  provider,
};