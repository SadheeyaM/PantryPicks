const express = require("express");
const router = express.Router();

const authenticate = require("../middlewares/authMiddleware");
const userClient = require("../clients/user");
const cartClient = require("../clients/cart");

const unwrap = (payload) => payload?.data?.data ?? payload?.data ?? payload;

const resolveCurrentUser = async (req) => {
	const response = await userClient.getUsers();
	const users = unwrap(response);

	if (!Array.isArray(users)) {
		return null;
	}

	const email = req.user?.email;
	return users.find((user) => String(user.userEmail || "").toLowerCase() === String(email || "").toLowerCase()) || null;
};

router.get("/me", authenticate, async (req, res) => {
	try {
		const user = await resolveCurrentUser(req);

		if (!user) {
			return res.status(404).json({ message: "User profile not found" });
		}

		// Normalize user response to include id field
		const normalizedUser = {
			...user,
			id: user.userId || user.id,
		};

		return res.json({ data: normalizedUser });
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch user profile" });
	}
});

router.patch("/me", authenticate, async (req, res) => {
	try {
		const user = await resolveCurrentUser(req);
		if (!user) {
			return res.status(404).json({ message: "User profile not found" });
		}

		const response = await userClient.updateUser(user.userId || user.id, req.body);
		return res.json(response.data);
	} catch (error) {
		return res.status(500).json({ message: "Failed to update user profile" });
	}
});

router.get("/me/cart", authenticate, async (req, res) => {
	try {
		const user = await resolveCurrentUser(req);
		if (!user) {
			return res.status(404).json({ message: "User profile not found" });
		}

		const cartsResponse = await cartClient.getAllCarts();
		const carts = unwrap(cartsResponse);
		const cartList = Array.isArray(carts) ? carts : [];
		const userId = user.userId || user.id;
		const currentCart = cartList.find((cart) => Number(cart.userId) === Number(userId)) || null;

		return res.json({ data: currentCart });
	} catch (error) {
		return res.status(500).json({ message: "Failed to fetch current user cart" });
	}
});

module.exports = router;
