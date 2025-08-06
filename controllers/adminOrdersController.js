const { Order, GroupOrders } = require('../models/ordersModel');


//@descr Admin

//@ get all previous orders detail
const getAllOrders = async (req, res) => {
  try {
    const allOrders = await Order.find({})
      .sort({ createdAt:-1 }); 

    res.status(200).json({success: true, message: "Fetched all orders", allOrders});
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error: get all orders', error });
  }
}

//@descr get all previous orders detail , this one is repeating in the orderscontroller also - need future rectification
const getUserOrders = async (req, res) => {
  try {
    const allOrders = await GroupOrders.find({ user: req.body.userId })
      .populate({ path: 'orderitems.order' }) // 1st level: populate order
      .sort({ createdAt: -1 });

    return res.status(200).json({ success: true, message: "all User Orders", allOrders });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server Error', error });
  }

};

//@descr updating single order status
const updateOrderStatus = async (req, res) => {
    try {
        const { newStatus, orderId } = req.body;

        // Optional: Validate against allowed statuses
        const allowedStatuses = ['notpayed', 'payed', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!allowedStatuses.includes(newStatus.toLowerCase())) {
          return res.status(400).json({ success: false, message: "Invalid status value" });
        };
        console.log('Here');
        const orderData = await Order.findById(orderId);
        if (!orderData) {
          return res.status(404).json({ success: false, message: "Order not found" });
        };

        //@descr check if already same
        if (newStatus === orderData.status ) {
          return res.status(409).json({success: true, message: "order status conflict"});
        };
        
        //@descr update
        orderData.status = newStatus;
        await orderData.save();

        console.log('Here2');
        return res.status(200).json({ success: true, message: "Order status updated successfully"});

    } catch (error) {
        return res.status(500).json({success: false, message: 'Server error when updating order status', error});
    };
};

module.exports = { 
    getAllOrders,
    getUserOrders,
    updateOrderStatus
};