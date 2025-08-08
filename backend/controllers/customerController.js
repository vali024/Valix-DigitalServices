import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

export const getCustomers = async (req, res) => {
    try {
        // Verify admin email from headers
        const adminEmail = req.headers['admin-email'];
        if (!adminEmail) {
            return res.status(401).json({
                success: false,
                message: 'Admin authentication required'
            });
        }

        // Find all non-admin users
        const users = await userModel.find(
            { isAdmin: false },
            'name email savedAddresses'
        ).lean();

        if (!users) {
            return res.status(200).json({
                success: true,
                customers: []
            });
        }

        // Get order counts in a single query
        const orderCounts = await orderModel.aggregate([
            {
                $group: {
                    _id: '$userId',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Create a map of user IDs to order counts
        const orderCountMap = new Map(
            orderCounts.map(item => [item._id.toString(), item.count])
        );

        // Format customer data
        const customers = users.map(user => {
            // Get default or first address
            const defaultAddress = user.savedAddresses?.find(addr => addr.isDefault) 
                || user.savedAddresses?.[0] 
                || {};

            return {
                _id: user._id,
                name: user.name || 'N/A',
                email: user.email || 'N/A',
                orderCount: orderCountMap.get(user._id.toString()) || 0,
                zipcode: defaultAddress.zipcode || 'N/A',
                phone: defaultAddress.phone || 'N/A'
            };
        });

        return res.status(200).json({
            success: true,
            customers
        });

    } catch (error) {
        console.error('Error in getCustomers:', error);
        return res.status(500).json({
            success: false,
            message: 'Error fetching customer data',
            error: error.message
        });
    }
};

export const getCustomerDetails = async (req, res) => {
    try {
        const { customerId } = req.params;

        // Get customer details including recent orders
        const customer = await userModel.findById(customerId);
        const orders = await orderModel.find({ userId: customerId })
            .sort({ createdAt: -1 })
            .limit(10);

        if (!customer) {
            return res.status(404).json({
                success: false,
                message: 'Customer not found'
            });
        }

        res.status(200).json({
            success: true,
            customer: {
                ...customer.toObject(),
                recentOrders: orders
            }
        });
    } catch (error) {
        console.error('Error in getCustomerDetails:', error);
        res.status(500).json({
            success: false,
            message: 'Error fetching customer details',
            error: error.message
        });
    }
};