// const crypto = require("crypto");
// const https = require("https");
// const axios = require("axios");

// // Use node-fetch if available, else rely on Node.js 18+ built-in fetch
// try {
//   global.fetch = require("node-fetch");
// } catch (e) {
//   // Node 18+ has built-in fetch, so this is fine
// }

// const REGION = process.env.AWS_REGION;
// const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;
// const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
// const CLIENT_SECRET = process.env.COGNITO_CLIENT_SECRET;
// const ALLOW_SELF_SIGNED =
//   String(process.env.COGNITO_ALLOW_SELF_SIGNED_CERTS || "")
//     .trim()
//     .toLowerCase() === "true";

// if (!REGION || !USER_POOL_ID || !CLIENT_ID) {
//   throw new Error("Missing Cognito configuration. Set AWS_REGION, COGNITO_USER_POOL_ID, and COGNITO_CLIENT_ID.");
// }

// // Explicitly bind TLS behavior for outbound Cognito calls.
// const httpsAgent = new https.Agent({ rejectUnauthorized: !ALLOW_SELF_SIGNED });

// const cognitoUrl = `https://cognito-idp.${REGION}.amazonaws.com/`;

// const buildSecretHash = username => {
//   if (!CLIENT_SECRET) return undefined;

//   return crypto
//     .createHmac("sha256", CLIENT_SECRET)
//     .update(`${username}${CLIENT_ID}`)
//     .digest("base64");
// };

// const signUpUser = async ({ email, password }) => {
//   const secretHash = buildSecretHash(email);

//   const payload = {
//     ClientId: CLIENT_ID,
//     Username: email,
//     Password: password,
//     UserAttributes: [{ Name: "email", Value: email }],
//     ...(secretHash && { SecretHash: secretHash })
//   };

//   try {
//     const { data } = await axios.post(cognitoUrl, payload, {
//       headers: {
//         "X-Amz-Target": "AWSCognitoIdentityProviderService.SignUp",
//         "Content-Type": "application/x-amz-json-1.1"
//       },
//       httpsAgent
//     });
//     return {
//       username: data.UserSub,
//       confirmed: data.UserConfirmed,
//       codeDelivery: data.CodeDeliveryDetails
//     };
//   } catch (error) {
//     const err = error.response?.data || error;
//     throw new Error(err.message || err.__type || JSON.stringify(err));
//   }
// };

// const loginUser = async ({ email, password }) => {
//   const secretHash = buildSecretHash(email);

//   const payload = {
//     AuthFlow: "USER_PASSWORD_AUTH",
//     ClientId: CLIENT_ID,
//     AuthParameters: {
//       USERNAME: email,
//       PASSWORD: password,
//       ...(secretHash && { SECRET_HASH: secretHash })
//     }
//   };

//   try {
//     const { data } = await axios.post(cognitoUrl, payload, {
//       headers: {
//         "X-Amz-Target": "AWSCognitoIdentityProviderService.InitiateAuth",
//         "Content-Type": "application/x-amz-json-1.1"
//       },
//       httpsAgent
//     });
    
//     return {
//       accessToken: data.AuthenticationResult?.AccessToken,
//       idToken: data.AuthenticationResult?.IdToken,
//       refreshToken: data.AuthenticationResult?.RefreshToken,
//       expiresIn: data.AuthenticationResult?.ExpiresIn,
//       challengeName: data.ChallengeName
//     };
//   } catch (error) {
//     const err = error.response?.data || error;
//     throw new Error(err.message || err.__type || JSON.stringify(err));
//   }
// };

// module.exports = {
//   signUpUser,
//   loginUser
// };
