const Order = require('../models/order.model');

exports.createOrder = async (req, res) => {
    try {
        const { OrderItems, Address, HouseNo, Landmark, Pincode, State, transaction_id        } = req.body;
        console.log(req.body)
        // Check if any field is empty
        if (!OrderItems || !Address || !HouseNo || !Landmark || !Pincode || !State || ! transaction_id) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        //check Transication id if already Present in order model then show order is already confirmes

        const checckOrder = await Order.findOne({ transaction_id });
        if (!checckOrder) {
            // Continue with order creation logic
            const order = new Order({
                OrderItems,
                Address,
                HouseNo,
                Landmark,
                Pincode,
                State,
                transaction_id,
                user: req.user._id, // Assuming you have user authentication middleware to get the user ID
            });
    
            const savedOrder = await order.save();
    
            // Send response
            res.status(201).json({ success: true, order: savedOrder });
        } else {
            // Handle the case where the order with the given transaction_id already exists
            return res.status(400).json({ error: 'Order already Confirm Thanks For Re-Confirm' });
        }

        // If all fields are good, save the data in the database (Order model)
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


//Show My Orders
exports.checkMyOrder = async()=>{
    try {
        const userId = req.user._id
        const orders = await Order.find({ user :userId }).sort('-createdAt');  // - createdAt will sort by date in descending order
        if(orders.length > 0){
            res.status(200).json({
                success:true,
                msg:"Order-Found SuccessFull",
                orders
            })
        }

    } catch (error) {
        console.log(error)
    }
}