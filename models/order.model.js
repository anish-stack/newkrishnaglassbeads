const mongoose = require('mongoose');

const OrderProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    discountPrice: {
        type: Number,
        default: 0,
        min: 0,
    },
    images: {
        type: String,
    },
    color: {
        type: String,
        trim: true,
        default:"none"
    },
    quantity:{
        type: String,
    },
    productId:{
        type:String
    }
});

const OrderSchema = new mongoose.Schema({
    OrderItems: {
        type: [OrderProductSchema],
    },
    Address: {
        type: String,
    },
    HouseNo: {
        type: Number,
    },
    Landmark: {
        type: String,
    },
    Pincode: {
        type: Number,
    },
    State: {
        type: String,
    },
    transaction_id: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
}, { timestamps: true });

const Order = mongoose.model('Order', OrderSchema);

module.exports = Order;
