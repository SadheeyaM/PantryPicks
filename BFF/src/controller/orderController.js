const orderClient = require('../clients/orders');

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
