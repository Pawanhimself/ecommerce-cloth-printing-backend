const mongoose = require('mongoose');

//@descr individual orders  
const orderSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  product: {
    /* type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true, */
    type: Number, // for testing
  },
  editedProduct: {
    /* type: mongoose.Schema.Types.ObjectId,
    ref: 'EditedProduct', */
    type: Number, // for testing
  },
  isDelivered: {
      type: Boolean,
      default: false,
    },
  deliveredAt: {
      type: Date,
    },
  status: {
      type: String,
      enum: ['notpayed','payed','processing', 'shipped', 'delivered', 'cancelled'],
      default: 'notpayed',
    },

}, {timestamps:true});


//@ descr grouping the individual oredrs when payment(each payment)
const groupOrdersSchema = new mongoose.Schema({
    user: {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
        required: true,
        index: true, // making the users as the index
    },
    orderitems: [
      {
        order: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Order',
          required: true,
        },
        
      },
    ],
    shippingAddress: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: ['PayPal', 'Stripe', 'UPI']
    },
    paymentResult: {
      id: String,
      status: String,
      update_time: String,
      email_address: String,
    },
    itemsPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    taxPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: {
      type: Number,
      required: true,
      default: 0.0,
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    }    
},{timestamps:true});



const Order = mongoose.model('Order', orderSchema);
const GroupOrders = mongoose.model('GroupOrders', groupOrdersSchema);

module.exports = { 
  Order, 
  GroupOrders 
};


