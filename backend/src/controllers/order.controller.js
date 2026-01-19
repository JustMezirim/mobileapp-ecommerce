import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";

export async function createOrder(req, res) {
    try {
        const { orderItems, shippingAddress } = req.body;
        const user = req.user;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({ error: "No order items provided" });
        }

        let totalPrice = 0;
        const processedItems = [];

        for (const item of orderItems) {
            const product = await Product.findById(item.productId);
            
            if (!product || !product.isActive) {
                return res.status(404).json({ error: `Product ${item.productId} not found` });
            }
            
            if (product.stock < item.quantity) {
                return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
            }

            const itemTotal = product.price * item.quantity;
            totalPrice += itemTotal;

            processedItems.push({
                product: product._id,
                quantity: item.quantity,
                price: product.price
            });

            // Update product stock
            product.stock -= item.quantity;
            await product.save();
        }

        const order = await Order.create({
            user: user._id,
            orderItems: processedItems,
            shippingAddress,
            totalPrice,
            placedAt: new Date()
        });

        const populatedOrder = await Order.findById(order._id)
            .populate('orderItems.product')
            .populate('user', 'name email');

        res.status(201).json({ message: "Order created successfully", order: populatedOrder });
    } catch (error) {
        console.error("Error creating order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getUserOrders(req, res) {
    try {
        const user = req.user;
        
        const orders = await Order.find({ user: user._id })
            .populate('orderItems.product')
            .sort({ createdAt: -1 });
            
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error fetching user orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getOrderById(req, res) {
    try {
        const { orderId } = req.params;
        const user = req.user;
        
        const order = await Order.findOne({ _id: orderId, user: user._id })
            .populate('orderItems.product')
            .populate('user', 'name email');
            
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        res.status(200).json({ order });
    } catch (error) {
        console.error("Error fetching order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function trackOrder(req, res) {
    try {
        const { orderId } = req.params;
        const user = req.user;
        
        const order = await Order.findOne({ _id: orderId, user: user._id })
            .populate('orderItems.product', 'name images')
            .select('orderStatus totalPrice createdAt placedAt pendingAt processingAt shippedAt inTransitAt deliveredAt');
            
        if (!order) {
            return res.status(404).json({ error: "Order not found" });
        }
        
        res.status(200).json({ 
            orderId: order._id,
            status: order.orderStatus,
            totalPrice: order.totalPrice,
            orderDate: order.createdAt,
            placedAt: order.placedAt,
            pendingAt: order.pendingAt,
            processingAt: order.processingAt,
            shippedAt: order.shippedAt,
            inTransitAt: order.inTransitAt,
            deliveredAt: order.deliveredAt,
            items: order.orderItems
        });
    } catch (error) {
        console.error("Error tracking order:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}