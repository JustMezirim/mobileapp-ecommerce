import { Router } from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { addAddress, addToWishlist, deleteAddress, getAddresses, getWishlist, removeFromwishlist, updateAddress, getProfile, updateProfile } from "../controllers/user.controller.js";

const router = Router();

router.use(protectRoute);

router.get("/profile", getProfile);
router.put("/profile", updateProfile);

router.post("/addresses", addAddress);
router.get("/address", getAddresses);
router.put("/addresses/:addressId", updateAddress)
router.post("/addresses/:addressId", deleteAddress)

router.post("/wishlist", addToWishlist)
router.delete("/wishlist/:productId", removeFromwishlist)
router.get("/wishlist", getWishlist)

export default router;