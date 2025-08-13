const { addToCart, createGroupOrder, getCart, getAllUserOrders, getSingleUserOrder} = require('../controllers/userOrdersController');
const { getAllOrders, getUserOrders, updateOrderStatus } = require('../controllers/adminOrdersController');

const ordersRoutes = require('express').Router();
const authorizeUser = require("../middlewares/authMiddleware");


// user orders Routes, protected-JWT
ordersRoutes.post('/addcart',authorizeUser, addToCart); // save in editproduct db doc

//@descr get only orders saved and not paied
ordersRoutes.get('/mycart',authorizeUser, getCart);

//@descr 
ordersRoutes.post('/checkout',authorizeUser, createGroupOrder); //payment status next function

//@desc get previous orders list
ordersRoutes.get('/myorders',authorizeUser , getAllUserOrders );

//@descr getiing individual order details
ordersRoutes.get('/my/:orderid', getSingleUserOrder);



// Admin order Routes
ordersRoutes.get('/admin' , getAllOrders);

ordersRoutes.get('/admin/user', getUserOrders );

//@descr updating status by manager-admin
ordersRoutes.put('/status', updateOrderStatus);

module.exports = {ordersRoutes};
