const { addToCart, createGroupOrder, getCart, getAllUserOrders, getSingleUserOrder} = require('../controllers/userOrdersController');
const { getAllOrders, getUserOrders, updateOrderStatus } = require('../controllers/adminOrdersController');

const ordersRoutes = require('express').Router();
const { authorize } = require("../middlewares/authMiddleware");


// user orders Routes, protected-JWT
ordersRoutes.post('/addcart',authorize({ type: "user" }), addToCart); // save in editproduct db doc

//@descr get only orders saved and not paied
ordersRoutes.get('/mycart',authorize({ type: "user" }), getCart);

//@descr 
ordersRoutes.post('/checkout',authorize({ type: "user" }), createGroupOrder); //payment status next function

//@desc get previous orders list
ordersRoutes.get('/myorders',authorize({ type: "user" }) , getAllUserOrders );

//@descr getiing individual order details
ordersRoutes.get('/my/:orderid',authorize({ type: "user" }), getSingleUserOrder);



// Admin order Routes
ordersRoutes.get('/admin' ,authorize({ type: "admin" }), getAllOrders);

ordersRoutes.get('/admin/user',authorize({ type: "admin" }), getUserOrders );

//@descr updating status by manager-admin
ordersRoutes.put('/status',authorize({ type: "admin" }), updateOrderStatus);

module.exports = {ordersRoutes};
