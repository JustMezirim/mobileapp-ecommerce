import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { createOrder, getUserOrders, getOrderById, trackOrder } from "../controllers/order.controller.js";

const router = Router();

router.use(protectRoute);

router.post("/", createOrder);
router.get("/", getUserOrders);
router.get("/:orderId", getOrderById);
router.get("/:orderId/track", trackOrder);

export default router;