const express = require("express");
const router = express.Router();
const cartController = require("../controller/cartController");
const authenticate = require("../middlewares/authMiddleware");

// All routes require authentication (customers managing their own carts)
router.post("/", authenticate, cartController.createCart);
router.get("/", authenticate, cartController.getAllCarts);
router.get("/:id", authenticate, cartController.getCartById);
router.post("/:cartId/items", authenticate, cartController.addItemToCart);
router.delete("/:cartId/items/:itemId", authenticate, cartController.removeItemFromCart);
router.patch("/:cartId/items/:itemId", authenticate, cartController.updateCartItem);

module.exports = router;