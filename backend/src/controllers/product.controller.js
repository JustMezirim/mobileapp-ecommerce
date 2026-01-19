import { Product } from "../models/product.model.js";

export async function getProducts(req, res) {
    try {
        const { category, search, page = 1, limit = 10 } = req.query;
        
        const query = { isActive: true };
        
        if (category) {
            query.category = category;
        }
        
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }
        
        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);
            
        const total = await Product.countDocuments(query);
        
        res.status(200).json({
            products,
            totalPages: Math.ceil(total / limit),
            currentPage: page
        });
    } catch (error) {
        console.error("Error fetching products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getProductById(req, res) {
    try {
        const { id } = req.params;
        const product = await Product.findById(id);
        
        if (!product || !product.isActive) {
            return res.status(404).json({ error: "Product not found" });
        }
        
        res.status(200).json(product);
    } catch (error) {
        console.error("Error fetching product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

export async function getCategories(req, res) {
    try {
        const categories = await Product.distinct("category", { isActive: true });
        res.status(200).json(categories);
    } catch (error) {
        console.error("Error fetching categories:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}