const orderClient = require('../clients/orders');
const cartClient = require('../clients/cart');
const productClient = require('../clients/product');

const checkoutInFlight = new Map();
const checkoutResults = new Map();

const unwrapPayload = (payload) => {
  if (payload && typeof payload === "object" && payload.data && typeof payload.data === "object") {
    return payload.data;
  }
  return payload;
};

const normalizeProducts = (payload) => {
  const unwrapped = unwrapPayload(payload);
  if (Array.isArray(unwrapped)) return unwrapped;
  if (unwrapped && Array.isArray(unwrapped.content)) return unwrapped.content;
  return [];
};

const deriveUserId = (req) => {
  const candidate = req?.user?.userId ?? req?.user?.id ?? req?.user?.sub;
  const numeric = Number(candidate);
  return Number.isFinite(numeric) && numeric > 0 ? numeric : null;
};

exports.confirmCheckout = async (req, res) => {
  let idempotencyKey = null;

  try {
    const userId = deriveUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unable to resolve user from token" });
    }

    const { cartId: requestedCartId } = req.body || {};
    let activeCartId = Number(requestedCartId || 0);

    if (!Number.isFinite(activeCartId) || activeCartId <= 0) {
      const cartsResponse = await cartClient.getAllCarts({ userId, status: "ACTIVE" });
      const cartsPayload = unwrapPayload(cartsResponse.data);
      const carts = Array.isArray(cartsPayload) ? cartsPayload : [];
      activeCartId = Number(carts[0]?.cartId || 0);
    }

    if (!Number.isFinite(activeCartId) || activeCartId <= 0) {
      return res.status(400).json({ message: "No active cart found for checkout" });
    }

    idempotencyKey = String(req.headers["idempotency-key"] || `checkout:${userId}:${activeCartId}`);

    if (checkoutResults.has(idempotencyKey)) {
      return res.status(201).json(checkoutResults.get(idempotencyKey));
    }

    if (checkoutInFlight.has(idempotencyKey)) {
      return res.status(409).json({ message: "Checkout already in progress" });
    }

    checkoutInFlight.set(idempotencyKey, true);

    const cartResponse = await cartClient.getCartById(activeCartId);
    const cart = unwrapPayload(cartResponse.data);
    const cartUserId = Number(cart?.userId || 0);

    if (!cart || typeof cart !== "object" || cartUserId !== userId) {
      return res.status(403).json({ message: "Cart does not belong to current user" });
    }

    const cartItems = Array.isArray(cart?.items) ? cart.items : [];
    if (cartItems.length === 0) {
      return res.status(400).json({ message: "Cannot checkout an empty cart" });
    }

    const productsResponse = await productClient.getProducts();
    const products = normalizeProducts(productsResponse.data);
    const productMap = new Map(products.map((product) => [Number(product.productId), product]));

    const outOfStock = [];
    const decrements = [];

    for (const item of cartItems) {
      const productId = Number(item?.productId || 0);
      const quantity = Number(item?.quantity || 0);
      const product = productMap.get(productId);
      const availableQty = Number(product?.productQuantity || 0);

      if (!product || quantity <= 0 || availableQty < quantity) {
        outOfStock.push({
          productId,
          requested: quantity,
          available: Math.max(availableQty, 0),
          productName: product?.productName || "Unknown product",
        });
      } else {
        decrements.push({ product, quantity });
      }
    }

    if (outOfStock.length > 0) {
      checkoutInFlight.delete(idempotencyKey);
      return res.status(409).json({
        message: "Some items are out of stock or unavailable",
        details: outOfStock,
      });
    }

    const originalQuantities = decrements.map(({ product, quantity }) => ({
      productId: product.productId,
      originalQuantity: Number(product.productQuantity || 0),
      nextQuantity: Number(product.productQuantity || 0) - quantity,
    }));

    for (const { product, quantity } of decrements) {
      const currentQty = Number(product.productQuantity || 0);
      const nextQty = currentQty - quantity;
      await productClient.updateProduct(product.productId, { productQuantity: nextQty });
    }

    const shippingAddress = req.body?.shippingAddress || {
      line1: "N/A",
      line2: "",
      city: "N/A",
      state: "N/A",
      country: "N/A",
      postalCode: "00000",
    };

    const orderItems = cartItems
      .map((item) => {
        const product = productMap.get(Number(item.productId));
        const price = Number(product?.price || 0);
        return {
          productId: Number(item.productId),
          quantity: Number(item.quantity),
          price,
        };
      })
      .filter((item) => Number.isFinite(item.productId) && item.productId > 0 && item.quantity > 0);

    const orderPayload = {
      customerId: userId,
      shippingAddress,
      items: orderItems,
    };

    let orderData;

    try {
      const orderResponse = await orderClient.createOrder(orderPayload);
      orderData = unwrapPayload(orderResponse.data);

      await cartClient.updateCart(activeCartId, { status: "CHECKED_OUT" });
    } catch (checkoutError) {
      for (const entry of originalQuantities) {
        try {
          await productClient.updateProduct(entry.productId, { productQuantity: entry.originalQuantity });
        } catch (rollbackError) {
          console.error("Failed to roll back product quantity:", rollbackError.message);
        }
      }

      try {
        if (orderData?.orderId) {
          await orderClient.updateOrder(orderData.orderId, {
            orderStatus: "CANCELLED",
            paymentStatus: "FAILED",
          });
        }
      } catch (orderRollbackError) {
        console.error("Failed to mark order as cancelled:", orderRollbackError.message);
      }

      checkoutInFlight.delete(idempotencyKey);
      throw checkoutError;
    }

    const responseBody = {
      message: "Checkout successful. Order created.",
      order: orderData,
      cartId: activeCartId,
      status: "CHECKED_OUT",
    };

    checkoutResults.set(idempotencyKey, responseBody);
    checkoutInFlight.delete(idempotencyKey);

    return res.status(201).json(responseBody);
  } catch (error) {
    console.error("Error confirming checkout:", error.message);
    return res.status(500).json({ message: "Error while confirming checkout" });
  } finally {
    if (idempotencyKey) {
      checkoutInFlight.delete(idempotencyKey);
    }
  }
};

exports.createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const response = await orderClient.createOrder(orderData);
    res.status(201).json(response.data);
  } catch (error) {
    console.error('Error creating order:', error.message);
    res.status(500).json({ message: "Error while creating order" });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const response = await orderClient.getOrders();
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ message: "Error while fetching orders" });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    const userId = deriveUserId(req);
    if (!userId) {
      return res.status(401).json({ message: "Unable to resolve user from token" });
    }

    const response = await orderClient.getOrdersByCustomerId(userId);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching customer orders:', error.message);
    res.status(500).json({ message: "Error while fetching customer orders" });
  }
};

exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const response = await orderClient.getOrderById(id);
    res.json(response.data);
  } catch (error) {
    console.error('Error fetching order:', error.message);
    res.status(500).json({ message: "Error while fetching order" });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const orderData = req.body;
    const response = await orderClient.updateOrder(id, orderData);
    res.json(response.data);
  } catch (error) {
    console.error('Error updating order:', error.message);
    res.status(500).json({ message: "Error while updating order" });
  }
};
