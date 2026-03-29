require('dotenv').config();
const express = require("express") ;
const cors = require("cors") ;

const app = express() ;

app.use(cors()) ;
app.use(express.json()) ;

app.use('/api/v1/auth', require('./routes/authRoutes')) ;
app.use('/api/v1/products', require('./routes/productRoutes'));
app.use('/api/v1/categories', require('./routes/categoryRoutes')) ;
app.use('/api/v1/carts', require('./routes/cartRoutes'));
app.use('/api/v1/orders', require('./routes/orderRoutes')) ;

app.get("/health", (req,res) => {
    res.json({status: "BFF Is Running"}) ;
}) ;

module.exports = app ;