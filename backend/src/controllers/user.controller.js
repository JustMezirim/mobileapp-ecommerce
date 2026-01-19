import { User } from "../models/user.model.js";

export async function addAddress(req, res) {
    try {
        const { fullName, phoneNumber, label, streetAddress, city, state, zipCode, isDefault } = req.body;
        const user = req.user;

        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        user.addresses.push({
            fullName,
            phoneNumber,
            label,
            streetAddress,
            city,
            state,
            zipCode,
            isDefault: isDefault || false
        });

        await user.save();

        res.status(201).json({message: "Address added successfully", addresses: user.addresses});
    } catch (error) {
        console.error("Error in addAddress controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getAddresses(req, res) {
    try {
        const user = req.user;
        
        res.status(200).json({addresses: user.addresses});
    } catch (error) {
        console.error("Error in getAddresses controller:", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function updateAddress(req, res) {
    try {
        const { fullName, phoneNumber, label, streetAddress, city, state, zipCode, isDefault } = req.body;
        const { addressId } = req.params;
        const user = req.user;
        const address = user.addresses.id(addressId);

        if (!address) {
            return res.status(404).json({ error: "Address not found"});
        }

        if (isDefault) {
            user.addresses.forEach((addr) => {
                addr.isDefault = false;
            });
        }

        address.fullName = fullName || address.fullName;
        address.phoneNumber = phoneNumber || address.phoneNumber;
        address.label = label || address.label;
        address.streetAddress = streetAddress || address.streetAddress;
        address.city = city || address.city;
        address.state = state || address.state;
        address.zipCode = zipCode || address.zipCode;
        address.isDefault = isDefault !== undefined ? isDefault : address.isDefault;

        await user.save();

        res.status(200).json({ message: "Address updated successfully", addresses: user.addresses });
    } catch (error) {
        console.error("Error in updateAddress controller:", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function deleteAddress(req, res) {
    try {
        const { addressId } = req.params;
        const user = req.user;

        user.addresses.pull(addressId);
        await user.save();

        res.status(200).json({ message: "Address deleted successfully", addresses: user.addresses});
    } catch (error) {
        console.error("Error in deleteAddress controller:", error);
        res.status(500).json({ error: "Internal server error"});
    }
}

export async function addToWishlist(req, res) {
    try {
        const { productId } = req.body;
        const user = req.user;

        if (user.wishList.includes(productId)) {
            return res.status(400).json({ error: "Product already in wishlist" });
        }

        user.wishList.push(productId);
        await user.save();

        res.status(200).json({ message: "Product added to wishlist", wishList: user.wishList });
    } catch (error) {
        console.error("Error in addToWishlist controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function removeFromwishlist(req, res) {
    try {
        const { productId } = req.params;
        const user = req.user;

        user.wishList.pull(productId);
        await user.save();

        res.status(200).json({ message: "Product removed from wishlist", wishList: user.wishList });
    } catch (error) {
        console.error("Error in removeFromwishlist controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getWishlist(req, res) {
    try {
        const user = await User.findById(req.user._id).populate('wishList');
        
        res.status(200).json({ wishList: user.wishList });
    } catch (error) {
        console.error("Error in getWishlist controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getProfile(req, res) {
    try {
        const user = req.user;
        
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phoneNumber: user.phoneNumber,
            imageURL: user.imageURL,
            clerkId: user.clerkId
        });
    } catch (error) {
        console.error("Error in getProfile controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function updateProfile(req, res) {
    try {
        const { name, phoneNumber, imageURL } = req.body;
        const user = req.user;

        if (name) user.name = name;
        if (phoneNumber !== undefined) user.phoneNumber = phoneNumber;
        if (imageURL) user.imageURL = imageURL;

        await user.save();

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        console.error("Error in updateProfile controller:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}