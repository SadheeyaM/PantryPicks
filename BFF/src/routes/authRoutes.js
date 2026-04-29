const express = require("express");
const jwt = require("jsonwebtoken");
const { provider, AUTH_PROVIDER } = require("../config/authProvider");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "mysecret";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1h";

const buildAccessToken = (user) => {
	return jwt.sign(
		{
			userId: user.userId,
			email: user.userEmail,
			role: user.userRole,
			authProvider: AUTH_PROVIDER,
		},
		JWT_SECRET,
		{ expiresIn: JWT_EXPIRES_IN }
	);
};

router.post("/signup", async (req, res) => {
	try {
		const createdUser = await provider.signup(req.body);
		return res.status(201).json({
			message: "User registered successfully",
			user: createdUser,
			authProvider: AUTH_PROVIDER,
		});
	} catch (error) {
		return res.status(error.response?.status || 400).json({
			message: "Sign up failed",
			details: error.response?.data || error.message,
		});
	}
});

router.post("/login", async (req, res) => {
	try {
		const authenticatedUser = await provider.login(req.body);
		const accessToken = buildAccessToken(authenticatedUser);

		return res.json({
			accessToken,
			tokenType: "Bearer",
			expiresIn: JWT_EXPIRES_IN,
			user: authenticatedUser,
			authProvider: AUTH_PROVIDER,
		});
	} catch (error) {
		return res.status(error.response?.status || 401).json({
			message: "Login failed",
			details: error.response?.data || error.message,
		});
	}
});

module.exports = router;