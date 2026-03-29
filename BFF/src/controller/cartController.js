const cartClient = require("../clients/cart");
const productClient = require("../clients/product");

exports.createCart = async (req, res) => {
  try {
    const cartData = req.body;
    const response = await cartClient.createCart(cartData);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating cart:', error.message);
    res.status(500).json({ message: "Error while creating cart" });
  }
};

exports.getCartById = async (req, res) => {
  try {
    const { id } = req.params;
    const cartResponse = await cartClient.getCartById(id);
    const cart = cartResponse.data.data;

    // Enrich cart items with product details
    if (cart.items && Array.isArray(cart.items)) {
      const enrichedItems = await Promise.all(
        cart.items.map(async (item) => {
          try {
            const productResponse = await productClient.getProductById(item.productId);
            return {
              ...item,
              productName: productResponse.data.data.productName,
              productDescription: productResponse.data.data.productDescription,
            };
          } catch (err) {
            console.error(`Failed to fetch product ${item.productId}:`, err.message);
            return { ...item, productName: "Unknown", productDescription: "N/A" };
          }
        })
      );
      cart.items = enrichedItems;
    }

    res.json(cart);
  } catch (error) {
    console.error('Error fetching cart:', error.message);
    res.status(500).json({ message: "Error while fetching cart" });
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const response = await cartClient.getAllCarts();
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching carts:', error.message);
    res.status(500).json({ message: "Error while fetching carts" });
  }
};

exports.addItemToCart = async (req, res) => {
  try {
    const { cartId } = req.params;
    const itemData = req.body;
    const response = await cartClient.addItemToCart(cartId, itemData);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error adding item to cart:', error.message);
    res.status(500).json({ message: "Error while adding item to cart" });
  }
};

exports.removeItemFromCart = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const response = await cartClient.removeItemFromCart(cartId, itemId);
    res.json(response.data);
  } catch (error) {
    console.error('Error removing item from cart:', error.message);
    res.status(500).json({ message: "Error while removing item from cart" });
  }
};

exports.updateCartItem = async (req, res) => {
  try {
    const { cartId, itemId } = req.params;
    const itemData = req.body;
    const response = await cartClient.updateCartItem(cartId, itemId, itemData);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating cart item:', error.message);
    res.status(500).json({ message: "Error while updating cart item" });
  }
};