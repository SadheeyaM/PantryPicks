const express = require("express") ;
const router = express.Router() ;
const orderController = require("../controller/orderController") ;
const authenticate = require("../middlewares/authMiddleware") ;

router.post('/', authenticate, orderController.createOrder) ;
router.get('/', authenticate, orderController.getOrders) ;
router.get('/:id', authenticate, orderController.getOrderById) ;    
router.put('/:id', authenticate, orderController.updateOrder) ;

module.exports = router ;