import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true
    },
    images: [{
        type: String,
        required: true
    }],
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

export const Product = mongoose.model('Product', productSchema);