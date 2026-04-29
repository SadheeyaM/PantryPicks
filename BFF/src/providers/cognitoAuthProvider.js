const unsupported = () => {
  throw new Error("Cognito provider is not configured in this branch. Set AUTH_PROVIDER=local or implement Cognito provider methods.");
};

module.exports = {
  signup: unsupported,
  login: unsupported,
};