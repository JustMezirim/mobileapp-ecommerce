import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { adminOnly } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";
import { 
    createProduct, 
    getAllProducts, 
    updateProduct, 
    deleteProduct,
    bulkDeleteProducts,
    bulkUpdateProductStatus,
    getAllOrders, 
    updateOrderStatus,
    bulkUpdateOrderStatus,
    getAllCustomers,
    deleteCustomer,
    bulkDeleteCustomers,
    getDashboardStats 
} from "../controllers/admin.controller.js";

const router = Router();

router.use(protectRoute);
router.use(adminOnly);

// Product routes
router.post("/products", upload.array('images', 3), createProduct);
router.get("/products", getAllProducts);
router.put("/products/:id", upload.array('images', 3), updateProduct);
router.delete("/products/:id", deleteProduct);
router.post("/products/bulk-delete", bulkDeleteProducts);
router.post("/products/bulk-update", bulkUpdateProductStatus);

// Order routes
router.get("/orders", getAllOrders);
router.put("/orders/:orderId", updateOrderStatus);
router.post("/orders/bulk-update", bulkUpdateOrderStatus);

// Customer routes
router.get("/customers", getAllCustomers);
router.delete("/customers/:id", deleteCustomer);
router.post("/customers/bulk-delete", bulkDeleteCustomers);

// Dashboard routes
router.get("/stats", getDashboardStats);

export default router;