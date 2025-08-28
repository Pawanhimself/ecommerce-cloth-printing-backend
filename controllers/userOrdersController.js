const { Order, GroupOrders } = require('../models/ordersModel');
const mongoose = require('mongoose');



//@descr Create individual new order (when a product is edited and saved)
const addToCart = async (req, res) => {
  const {product, editedProduct} = req.body;
  const order = new Order({

    user: req.user._id,
    product,
    editedProduct
  });
  await order.save();
  return res.status(201).json({ orderId: order._id });
};

//@descr get only unpayed orders
const getCart = async (req, res) => {
  try {
    const cartOrders = await Order.find({ 
      user: req.user._id, 
      status: 'notpayed' 
    }).lean();

    return res.status(200).json({success: true, message: "CartOrders", cartOrders});
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

//@descr group orders for payment
const createGroupOrder = async (req, res) => {
  try {
    const { orderIds, payment, shippingAddress } = req.body;
    
    // check product
    if(!orderIds || orderIds.length == 0){
      return res.status(400).json({success: false, message:"Add atleast one order-item"})
    }
    
    // check valid order
    const invalidId = orderIds.find(id => !mongoose.Types.ObjectId.isValid(id));
    if (invalidId) {
      return res.status(400).json({success: false, message: `Invalid order ID: ${invalidId}` });
    }
  console.log('here');
    // check for address
    if(!shippingAddress) {
      return res.status(400).json({success: false, message:"Need Shipping Address"})
    };
    // check if all orders belong to the user
    // check payment method
    //...

    const groupOrder = new GroupOrders({
      user: req.user._id,
      orderitems:  orderIds.map(id => ({ order: id })),
      paymentMethod: payment.method,
      shippingAddress
      // ... other fields as needed
    });

    await groupOrder.save();
    res.status(201).json({success: true, message: 'Group order created successfully', groupOrder });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'server error: Failed to initiate -create group order', err})
  };
};

//@descr get previous orders list
const getAllUserOrders = async (req, res) => {
  try {
    const allOrders = await GroupOrders.find({ user: req.user._id })
      .populate({ path: 'orderitems.order' }) // 1st level: populate order
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, message: "allOrders", allOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }
};

//@descr get single user order details
const getSingleUserOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderid)

    if (!order) {
      return res.status(404).json({ succes: false, message: " no such order"});
    };

    return res.status(200).json({ success: true, message: " order Data", order});

  } catch (error) {
      return res.status(500).json({success: false, message: " server error while getting single order data", error });
  };
};

module.exports = { 
    addToCart,
    getCart,
    createGroupOrder,
    getAllUserOrders,
    getSingleUserOrder
}