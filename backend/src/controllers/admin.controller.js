import cloudinary from "../config/cloudinary.js"
import { Product } from "../models/product.model.js"
import { Order } from "../models/order.model.js"
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

export async function createProduct(req, res) {
    try {
        const { name, description, price, stock, category } = req.body;

        if (!name || !description || !price || !stock || !category) {
            return res.status(400).json({message: "All fields are required" })
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: "At least one image is required" })
        }

        if (req.files.length > 3) {
            return res.status(400).json({ message: "Maximum 3 images allowed" })
        }

        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    { folder: "products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(file.buffer);
            });
        });

        const uploadResults = await Promise.all(uploadPromises);

        const imageUrls = uploadResults.map((result) => result.secure_url);

        const product = await Product.create({
            name,
            description,
            price: parseFloat(price),
            stock: parseInt(stock),
            category,
            images: imageUrls,
        })

        res.status(201).json(product)
    } catch (error) {
        console.error("Error creating product")
        res.status(500).json({ message: "Internal server error"})
    }
} 

export async function getAllProducts(_, res) {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.status(200).json(products)
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ message: "Internal server error"})
    }
}

export async function updateProduct(req, res) {
    try {
        const {id} = req.params
        const { name, description, price, stock, category } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        if (name) product.name = name;
        if (description) product.description = description;
        if (price !== undefined) product.price = parseFloat(price);
        if (stock !== undefined) product.stock = parseInt(stock);
        if (category) product.category = category;

        // handle image updates if new images are uploaded

        if (req.files && req.files.length > 0) {
            if (req.files.length > 3) {
                return res.status(400).json({ message: "Maximum 3 images allowed"})
            }

            const uploadPromises = req.files.map((file) => {
                return new Promise((resolve, reject) => {
                    cloudinary.uploader.upload_stream(
                        { folder: "products" },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    ).end(file.buffer);
                });
            });

            const uploadResults = await Promise.all(uploadPromises);
            product.images = uploadResults.map((result) => result.secure_url);
        }

        await product.save()
        res.status(200).json(product);
    } catch (error) {
        console.error("Error updating products:", error);
        res.status(500).json({ message: "Internal server error"})
    }
}

export async function deleteProduct(req, res) {
    try {
        const { id } = req.params;
        
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        
        await Product.findByIdAndDelete(id);
        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function bulkDeleteProducts(req, res) {
    try {
        const { productIds } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "Product IDs are required" });
        }
        
        await Product.deleteMany({ _id: { $in: productIds } });
        res.status(200).json({ message: `${productIds.length} products deleted successfully` });
    } catch (error) {
        console.error("Error bulk deleting products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function bulkUpdateProductStatus(req, res) {
    try {
        const { productIds, status } = req.body;
        
        if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
            return res.status(400).json({ message: "Product IDs are required" });
        }
        
        const updateData = {};
        if (status === 'active') updateData.isActive = true;
        if (status === 'inactive') updateData.isActive = false;
        
        await Product.updateMany(
            { _id: { $in: productIds } },
            updateData
        );
        
        res.status(200).json({ message: `${productIds.length} products updated successfully` });
    } catch (error) {
        console.error("Error bulk updating products:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export async function getAllOrders(req,res) {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("orderItems.product")
            .sort({ createdAt: -1 });
        res.status(200).json({ orders });
    } catch (error) {
        console.error("Error in getAllOrders controller:", error)
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateOrderStatus(req,res) {
    try {
        const { orderId } = req.params;
        const { status } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ error: "Order not found"});
        }

        if (!["placed", "pending", "processing", "shipped", "in_transit", "delivered", "cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status"})
        }

        order.orderStatus = status;

        if (status === "placed" && !order.placedAt) {
            order.placedAt = new Date();
        }

        if (status === "pending" && !order.pendingAt) {
            order.pendingAt = new Date();
        }

        if (status === "processing" && !order.processingAt) {
            order.processingAt = new Date();
        }

        if (status === "shipped" && !order.shippedAt) {
            order.shippedAt = new Date();
        }

        if (status === "in_transit" && !order.inTransitAt) {
            order.inTransitAt = new Date();
        }

        if (status === "delivered" && !order.deliveredAt) {
            order.deliveredAt = new Date();
        }

        if (status === "cancelled" && !order.cancelledAt) {
            order.cancelledAt = new Date();
        }

        await order.save()

        res.status(200).json({ message: "Order status updated successfully", order })
    } catch (error) {
        console.error("Error in updateOrderStatus controller:", error)
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function bulkUpdateOrderStatus(req, res) {
    try {
        const { orderIds, status } = req.body;
        
        if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
            return res.status(400).json({ error: "Order IDs are required" });
        }
        
        if (!["placed", "pending", "processing", "shipped", "in_transit", "delivered", "cancelled"].includes(status)) {
            return res.status(400).json({ error: "Invalid status" });
        }
        
        const updateData = { orderStatus: status };
        const currentDate = new Date();
        
        // Add timestamp fields based on status
        switch (status) {
            case "placed":
                updateData.placedAt = currentDate;
                break;
            case "pending":
                updateData.pendingAt = currentDate;
                break;
            case "processing":
                updateData.processingAt = currentDate;
                break;
            case "shipped":
                updateData.shippedAt = currentDate;
                break;
            case "in_transit":
                updateData.inTransitAt = currentDate;
                break;
            case "delivered":
                updateData.deliveredAt = currentDate;
                break;
            case "cancelled":
                updateData.cancelledAt = currentDate;
                break;
        }
        
        await Order.updateMany(
            { _id: { $in: orderIds } },
            updateData
        );
        
        res.status(200).json({ message: `${orderIds.length} orders updated successfully` });
    } catch (error) {
        console.error("Error bulk updating orders:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAllCustomers(_,res) {
    try {
        const customers = await User.find({ 
            email: { $ne: ENV.ADMIN_EMAIL } 
        })
        .populate('wishList', 'name price images')
        .sort({ createdAt: -1 });
        res.status(200).json({ customers });
    } catch (error) {
        console.error("Error fetching customers:", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function deleteCustomer(req, res) {
    try {
        const { id } = req.params;
        
        const customer = await User.findById(id);
        if (!customer) {
            return res.status(404).json({ error: "Customer not found" });
        }
        
        if (customer.email === ENV.ADMIN_EMAIL) {
            return res.status(403).json({ error: "Cannot delete admin user" });
        }
        
        await User.findByIdAndDelete(id);
        res.status(200).json({ message: "Customer deleted successfully" });
    } catch (error) {
        console.error("Error deleting customer:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function bulkDeleteCustomers(req, res) {
    try {
        const { customerIds } = req.body;
        
        if (!customerIds || !Array.isArray(customerIds) || customerIds.length === 0) {
            return res.status(400).json({ error: "Customer IDs are required" });
        }
        
        // Prevent deletion of admin user
        const adminUser = await User.findOne({ email: ENV.ADMIN_EMAIL });
        const filteredIds = customerIds.filter(id => id !== adminUser?._id.toString());
        
        await User.deleteMany({ _id: { $in: filteredIds } });
        res.status(200).json({ message: `${filteredIds.length} customers deleted successfully` });
    } catch (error) {
        console.error("Error bulk deleting customers:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getDashboardStats(_, res) {
    try {
        // Current period (this month)
        const currentDate = new Date();
        const startOfCurrentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const startOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
        const endOfPreviousMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0);

        // Current month stats
        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments({ 
            email: { $ne: ENV.ADMIN_EMAIL } 
        });
        const totalProducts = await Product.countDocuments();

        // Previous month stats for trend calculation
        const previousOrders = await Order.countDocuments({
            createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
        });
        const previousCustomers = await User.countDocuments({ 
            email: { $ne: ENV.ADMIN_EMAIL },
            createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
        });
        const previousProducts = await Product.countDocuments({
            createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
        });

        // Current revenue calculation
        const revenueResult = await Order.aggregate([
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ]);
        const totalRevenue = revenueResult[0]?.total || 0;

        // Previous month revenue
        const previousRevenueResult = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfPreviousMonth, $lte: endOfPreviousMonth }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" },
                },
            },
        ]);
        const previousRevenue = previousRevenueResult[0]?.total || 0;

        // Order status breakdown
        const orderStatusStats = await Order.aggregate([
            {
                $group: {
                    _id: "$orderStatus",
                    count: { $sum: 1 }
                }
            }
        ]);

        const orderStats = {
            pending: 0,
            processing: 0,
            shipped: 0,
            delivered: 0,
            cancelled: 0
        };
        
        orderStatusStats.forEach(stat => {
            if (orderStats.hasOwnProperty(stat._id)) {
                orderStats[stat._id] = stat.count;
            }
        });

        // Today's stats
        const today = new Date();
        const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: startOfDay }
        });

        const todayRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: startOfDay }
                }
            },
            {
                $group: {
                    _id: null,
                    total: { $sum: "$totalPrice" }
                }
            }
        ]);

        // Stock alerts
        const lowStockProducts = await Product.countDocuments({
            stock: { $gt: 0, $lte: 10 }
        });

        const outOfStockProducts = await Product.countDocuments({
            stock: 0
        });

        // Monthly revenue (last 6 months)
        const monthlyRevenue = await Order.aggregate([
            {
                $match: {
                    createdAt: {
                        $gte: new Date(new Date().setMonth(new Date().getMonth() - 6))
                    }
                }
            },
            {
                $group: {
                    _id: {
                        year: { $year: "$createdAt" },
                        month: { $month: "$createdAt" }
                    },
                    revenue: { $sum: "$totalPrice" },
                    orders: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        // Top products by revenue
        const topProducts = await Order.aggregate([
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    totalRevenue: { $sum: { $multiply: ["$orderItems.quantity", "$orderItems.price"] } },
                    totalSales: { $sum: "$orderItems.quantity" }
                }
            },
            {
                $lookup: {
                    from: "products",
                    localField: "_id",
                    foreignField: "_id",
                    as: "productInfo"
                }
            },
            { $unwind: "$productInfo" },
            {
                $project: {
                    name: "$productInfo.name",
                    totalRevenue: 1,
                    totalSales: 1
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 5 }
        ]);

        // Recent activity (last 10 activities)
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5)
            .select("_id orderStatus totalPrice createdAt user");

        const recentProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(3)
            .select("name createdAt");

        // Average order value
        const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        res.status(200).json({
            // Basic stats
            totalRevenue,
            totalOrders,
            totalCustomers,
            totalProducts,
            
            // Previous period data for trend calculation
            previousRevenue,
            previousOrders,
            previousCustomers,
            previousProducts,
            
            // Order breakdown
            orderStats,
            
            // Today's performance
            todayStats: {
                orders: todayOrders,
                revenue: todayRevenue[0]?.total || 0
            },
            
            // Stock alerts
            stockAlerts: {
                lowStock: lowStockProducts,
                outOfStock: outOfStockProducts
            },
            
            // Performance metrics
            avgOrderValue,
            
            // Charts data
            monthlyRevenue,
            topProducts,
            
            // Recent activity
            recentActivity: {
                orders: recentOrders,
                products: recentProducts
            },
            
            // Timestamp for realtime tracking
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error("Error fetching dashboard stats:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}