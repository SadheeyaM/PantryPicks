const jwt = require("jsonwebtoken");
const jwkToPem = require("jwk-to-pem");
const axios = require("axios");

const AUTH_PROVIDER = (process.env.AUTH_PROVIDER || "local").trim().toLowerCase();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";
const REGION = process.env.AWS_REGION;
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

let pems;

const getPems = async () => {
  if (pems) return pems;

  const url = `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}/.well-known/jwks.json`;
  const { data } = await axios.get(url);

  pems = {};
  data.keys.forEach(key => {
    pems[key.kid] = jwkToPem(key);
  });

  return pems;
};

const authenticate = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  if (AUTH_PROVIDER === "local") {
    try {
      const verified = jwt.verify(token, JWT_SECRET);
      req.user = verified;
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Token verification failed" });
    }
  }

  try {
    const decoded = jwt.decode(token, { complete: true });
    if (!decoded?.header?.kid) {
      return res.status(401).json({ message: "Malformed token" });
    }

    const pems = await getPems();

    const pem = pems[decoded.header.kid];

    if (!pem) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const verified = jwt.verify(token, pem, {
      issuer: `https://cognito-idp.${REGION}.amazonaws.com/${USER_POOL_ID}`
    });

    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Token verification failed" });
  }
};

module.exports = authenticate;