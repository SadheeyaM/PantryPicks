const express = require("express");
const router = express.Router();
const productController = require("../controller/productController") ;
const authenticate = require("../middlewares/authMiddleware");
const requireRole = require("../middlewares/roleMiddleware") ;

router.get('/', authenticate, productController.getProductsWithCategory) ;
router.get('/:id', authenticate, productController.getProductById) ;
router.post('/', authenticate, requireRole('SUPPLIER'), productController.createProduct) ;
router.patch('/:id', authenticate, productController.updateProduct) ;
router.put('/:id', authenticate, productController.updateProduct) ;

module.exports = router ;