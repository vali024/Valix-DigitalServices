import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const placeOrder = async (req, res) => {
    try {
        const { items, amount, address, payment } = req.body;
        
        // Create new order
        const newOrder = new orderModel({
            userId: req.userId,
            items,
            amount,
            address,
            payment: {
                method: 'COD', // Only support COD for now
                status: 'pending'
            },
            status: 'confirmed'
        });
        
        await newOrder.save();
        await clearUserCart(req.userId);
        
        return res.json({
            success: true,
            message: "Order placed successfully",
            orderId: newOrder._id
        });

        res.json({
            success: true,
            orderId: newOrder._id,
            paymentDetails: {
                orderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency
            }
        });

    } catch (error) {
        console.error("Error placing order:", error);
        res.status(500).json({
            success: false,
            message: "Failed to place order. Please try again."
        });
    }
};

// Helper function to clear user's cart
const clearUserCart = async (userId) => {
    try {
        await userModel.findByIdAndUpdate(userId, { cartData: {} });
    } catch (error) {
        console.error("Error clearing user cart:", error);
    }
};

const verifyOrderPayment = async (req, res) => {
    try {
        const { orderId, razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        // Verify the payment signature
        const generatedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + "|" + razorpay_payment_id)
            .digest('hex');

        if (generatedSignature === razorpay_signature) {
            // Update order status
            await orderModel.findByIdAndUpdate(orderId, {
                status: 'confirmed',
                'payment.status': 'completed',
                'payment.transactionId': razorpay_payment_id
            });

            // Clear user's cart
            await clearUserCart(order.userId);

            return res.json({
                success: true,
                message: "Payment verified and order confirmed"
            });
        }

        // If signature verification fails
        await orderModel.findByIdAndUpdate(orderId, {
            status: 'payment_failed',
            'payment.status': 'failed'
        });

        return res.status(400).json({
            success: false,
            message: "Payment verification failed - invalid signature"
        });

    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({
            success: false,
            message: "Error processing payment verification"
        });
    }
};

const userOrders = async (req, res) => {
    try {
        const userId = req.userId; // Get userId from auth middleware
        const orders = await orderModel.find({ userId })
            .sort({ createdAt: -1 }); // Sort by newest first
        
        res.json({
            success: true,
            data: orders
        });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({
            success: false,
            message: "Error fetching your orders"
        });
    }
}

//Listing orders for admin panel
const listOrders = async (req,res)=>{
    try{
        const orders = await orderModel.find({});
        res.json({success:true,data:orders})
    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }
}

// api for updating order status
const updateStatus = async (req,res) =>{
   try{
       await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status})
       res.json({success:true,message:"Status Updated"})
   }catch(error){
       console.log(error);
       res.json({success:false,message:"Error"})
   }
}

// Get customer data from orders
const getCustomers = async (req, res) => {
    try {
        // Verify admin email
        const adminEmail = req.headers['admin-email'];
        if (!adminEmail || !['lovelyboyarun91@gmail.com', 'chanvifarms9@gmail.com'].includes(adminEmail)) {
            return res.status(403).json({
                success: false,
                message: "Access denied. Admin privileges required."
            });
        }

        // Get all orders and extract customer information
        const orders = await orderModel.find({}).sort({ createdAt: -1 });
        
        const customerMap = new Map();
        
        orders.forEach(order => {
            if (!order.address) return;
            
            const { address } = order;
            // Using email and phone as unique identifier for a customer
            const customerId = `${address.email}-${address.phone}`; 
            
            if (!customerMap.has(customerId)) {
                customerMap.set(customerId, {
                    name: `${address.firstName} ${address.lastName}`,
                    email: address.email || 'N/A',
                    phone: address.phone || 'N/A',
                    address: {
                        city: address.city || 'N/A',
                        zipcode: address.zipcode || 'N/A'
                    },
                    orderCount: 1,
                    firstOrderDate: order.createdAt,
                    lastOrderDate: order.createdAt
                });
            } else {
                const customer = customerMap.get(customerId);
                customer.orderCount += 1;
                // Update first and last order dates
                if (new Date(order.createdAt) > new Date(customer.lastOrderDate)) {
                    customer.lastOrderDate = order.createdAt;
                }
                if (new Date(order.createdAt) < new Date(customer.firstOrderDate)) {
                    customer.firstOrderDate = order.createdAt;
                }
            }
        });

        const customers = Array.from(customerMap.values());
        
        res.json({
            success: true,
            data: customers
        });
    } catch (error) {
        console.error('Error getting customers:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customer data'
        });
    }
};

// Delete an order
const deleteOrder = async (req, res) => {
    try {
        const orderId = req.params.id;
        
        // Check if order exists
        const order = await orderModel.findById(orderId);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }
        
        // Check if order status is delivered
        if (order.status.toLowerCase() !== "delivered") {
            return res.status(403).json({
                success: false,
                message: "Only delivered orders can be deleted"
            });
        }
        
        // Delete the order
        await orderModel.findByIdAndDelete(orderId);
        
        res.json({
            success: true,
            message: "Order deleted successfully"
        });
    } catch (error) {
        console.error("Error deleting order:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting order"
        });
    }
};

export { placeOrder, userOrders, listOrders, updateStatus, getCustomers, deleteOrder }
