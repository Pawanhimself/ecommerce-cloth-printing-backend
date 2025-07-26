const ordersRoutes = require('express').Router();



// user orders Routes, protected-JWT
ordersRoutes.post('/',(req,res) => res.send({message:"add new orders"}));

ordersRoutes.get('/my',(req,res) => res.send({message:"Get user orders"}));

ordersRoutes.get('/my/:itemid',(req,res) => res.send({message:"Get user single order details"}));

// Admin order Routes
ordersRoutes.get('/admin',(req,res) => res.send({message:"Admin:get all orders- admin dashboard"}));

ordersRoutes.get('/admin/user/:userId',(req,res) => res.send({message:"Admin:get all orders- admin dashboard"}));

ordersRoutes.put('/pay',(req,res) => res.send({message:"Admin:mark order- paid"}));

ordersRoutes.put('/status',(req,res) => res.send({message:"Admin:update order status"}));

module.exports = {ordersRoutes};
